"use client";

import { useCallback, useEffect, useState } from "react";
import { NFTCard } from "./NFTCard";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface NFTData {
  image: string;
  name: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

// Cache object to store NFT data
const nftCache: { [key: string]: NFTData } = {};

export const NFTDisplay = () => {
  const { address } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState(0);

  // Get contract instance
  const { data: nftContract } = useScaffoldContract({
    contractName: "SocialBattleNFT",
  });

  const { data: hasMinted, isLoading: isCheckingMinted } = useScaffoldReadContract({
    contractName: "SocialBattleNFT",
    functionName: "hasMinted",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  // Get user's token ID
  const { data: userTokenId } = useScaffoldReadContract({
    contractName: "SocialBattleNFT",
    functionName: "userTokenId",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  // Debounced fetch function
  const fetchNFTData = useCallback(async () => {
    if (!nftContract || !address || !hasMinted || !userTokenId) return;

    // Check if we've fetched recently (within 5 seconds)
    const now = Date.now();
    if (now - lastFetchTimestamp < 5000) {
      return;
    }
    setLastFetchTimestamp(now);

    // Check cache first
    const cacheKey = `${address}-${userTokenId.toString()}`;
    if (nftCache[cacheKey]) {
      setNftData(nftCache[cacheKey]);
      setError(null);
      return;
    }

    try {
      setIsLoadingNFT(true);

      // Add delay between retries
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      // Try to fetch tokenURI with retries
      let tokenURI = null;
      let retries = 3;

      while (retries > 0) {
        try {
          // Use the user's specific token ID
          tokenURI = await nftContract.read.tokenURI([userTokenId]);
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await delay(1000); // Wait 1 second before retry
        }
      }

      if (!tokenURI) throw new Error("Failed to fetch tokenURI");

      // List of IPFS gateways to try
      const ipfsGateways = [
        "https://ipfs.io/ipfs/",
        "https://gateway.pinata.cloud/ipfs/",
        `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/`,
        "https://cloudflare-ipfs.com/ipfs/",
        "https://gateway.ipfs.io/ipfs/",
      ];

      let metadata = null;
      let error = null;

      // Try each gateway until one works
      for (const gateway of ipfsGateways) {
        try {
          const httpsURI = tokenURI.replace("ipfs://", gateway);
          const response = await fetch(httpsURI);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          metadata = await response.json();

          const imageHash = metadata.image.replace("ipfs://", "");
          metadata.image = `${gateway}${imageHash}`;
          break;
        } catch (e) {
          error = e;
          console.log(`Failed to fetch from ${gateway}:`, e);
          continue;
        }
      }

      if (metadata) {
        // Store in cache
        nftCache[cacheKey] = metadata;
        setNftData(metadata);
        setError(null);
      } else {
        throw error || new Error("Failed to fetch metadata from all gateways");
      }
    } catch (error) {
      console.error("Error fetching NFT:", error);
      setError("Failed to load NFT data. Please try refreshing the page.");
    } finally {
      setIsLoadingNFT(false);
    }
  }, [nftContract, address, hasMinted, userTokenId, lastFetchTimestamp]);

  // Fetch NFT data when component mounts or dependencies change
  useEffect(() => {
    fetchNFTData();
  }, [fetchNFTData]);

  const { writeContractAsync: mintNFT } = useScaffoldWriteContract("SocialBattleNFT", {});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size too large. Please choose a file under 10MB.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !name || !description) {
      setError("Please fill in all fields");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("description", description);

      const response = await fetch("/api/pinata", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await mintNFT({
          functionName: "mintNFT",
          args: [data.tokenUri],
        });

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
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {hasMinted ? (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Your Social Battle NFT</h2>

          {isLoadingNFT ? (
            <div className="text-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-4">Loading your NFT...</p>
            </div>
          ) : nftData ? (
            <NFTCard name={nftData.name} image={nftData.image} attributes={nftData.attributes} />
          ) : (
            <div className="text-center py-4">
              <p className="text-error">Failed to load NFT data</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Mint Your Social Battle NFT</h2>
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
              <div className="mt-4">
                <NFTCard
                  name={name || "Your NFT"}
                  image={previewUrl}
                  attributes={[
                    { trait_type: "Level", value: "1" },
                    { trait_type: "XP", value: "0" },
                    { trait_type: "Strength", value: "?" },
                    { trait_type: "Vitality", value: "?" },
                    { trait_type: "Agility", value: "?" },
                  ]}
                />
              </div>
            )}
            <button
              className={`btn btn-primary w-full ${isUploading ? "loading" : ""}`}
              onClick={handleUpload}
              disabled={!file || !name || isUploading}
            >
              {isUploading ? "Minting..." : "Mint NFT"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
