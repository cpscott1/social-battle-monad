import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Forward the request directly to Pinata's API
    const uploadRequest = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });

    if (!uploadRequest.ok) {
      const error = await uploadRequest.json();
      throw new Error(error.message || `Upload failed with status: ${uploadRequest.status}`);
    }

    const uploadResponse = await uploadRequest.json();
    console.log("Pinata upload response:", uploadResponse);

    if (!uploadResponse.IpfsHash) {
      throw new Error("Failed to get IPFS hash");
    }

    // Create and upload metadata
    const metadata = {
      name: (formData.get("name") as string) || "Social Battle NFT",
      description: (formData.get("description") as string) || "A Social Battle NFT",
      image: `ipfs://${uploadResponse.IpfsHash}`,
      attributes: [
        {
          trait_type: "Level",
          value: "1",
        },
        {
          trait_type: "XP",
          value: "0",
        },
      ],
    };

    // Upload metadata to Pinata
    const metadataRequest = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify(metadata),
    });

    if (!metadataRequest.ok) {
      const error = await metadataRequest.json();
      throw new Error(error.message || `Metadata upload failed with status: ${metadataRequest.status}`);
    }

    const metadataResponse = await metadataRequest.json();
    console.log("Metadata upload response:", metadataResponse);

    return NextResponse.json({
      success: true,
      tokenUri: `ipfs://${metadataResponse.IpfsHash}`,
      imageUrl: `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${uploadResponse.IpfsHash}`,
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error uploading to Pinata" },
      { status: 500 },
    );
  }
}
