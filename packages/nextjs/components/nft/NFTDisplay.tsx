"use client";

import { useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const NFTDisplay = () => {
  const { address } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: hasMinted, isLoading: isCheckingMinted } = useScaffoldReadContract({
    contractName: "SocialBattleNFT",
    functionName: "hasMinted",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  const { writeContractAsync: mintNFT, isMining: isMinting } = useScaffoldWriteContract("SocialBattleNFT", {});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    console.log("Selected file in handleFileChange:", selectedFile);
    console.log("File type in handleFileChange:", selectedFile.type);

    // Clear any previous errors
    setError(null);

    // Validate file size (e.g., max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size too large. Please choose a file under 10MB.");
      return;
    }

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Create a new File instance to ensure proper type
    const newFile = new File([selectedFile], selectedFile.name, {
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
    });

    setFile(newFile);
    const url = URL.createObjectURL(newFile);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!file || !name || !description) {
      setError("Please fill in all fields");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Debug file type
      console.log("File type:", file);
      console.log("Is file an instance of Blob?", file instanceof Blob);
      console.log("Is file an instance of File?", file instanceof File);
      console.log("File properties:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      });

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("description", description);

      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const response = await fetch("/api/pinata", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload response:", data);

      if (data.success) {
        console.log("Upload successful, tokenUri:", data.tokenUri);
        // Mint the NFT with the token URI
        await mintNFT({
          functionName: "mintNFT",
          args: [data.tokenUri],
        });

        // Reset form after successful mint
        setFile(null);
        setName("");
        setDescription("");
        setPreviewUrl(null);
      } else {
        throw new Error(data.error || "Failed to upload");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to upload and mint NFT");
    } finally {
      setIsUploading(false);
    }
  };

  if (!address) {
    return (
      <div className="bg-base-200 p-6 rounded-lg shadow-lg">
        <p className="text-lg">Please connect your wallet to view and mint NFTs.</p>
      </div>
    );
  }

  if (isCheckingMinted) {
    return (
      <div className="bg-base-200 p-6 rounded-lg shadow-lg">
        <p className="text-lg">Checking NFT status...</p>
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg w-full max-w-2xl">
      {hasMinted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Social Battle NFT</h2>
          <p className="mb-4">You have already minted your NFT!</p>
          {/* We'll add NFT display here later */}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mint Your Social Battle NFT</h2>
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">NFT Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter NFT name"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter NFT description"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Upload Image (Max 10MB)</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {error && <div className="text-error text-sm mt-2">{error}</div>}
            {previewUrl && (
              <div className="mt-4 relative w-64 h-64 mx-auto">
                <Image src={previewUrl} alt="Preview" fill className="rounded-lg object-contain" />
              </div>
            )}
            <button
              className="btn btn-primary mt-4"
              onClick={handleUpload}
              disabled={isUploading || isMinting || !file || !name || !description}
            >
              {isUploading ? "Uploading to IPFS..." : isMinting ? "Minting NFT..." : "Upload & Mint NFT"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
