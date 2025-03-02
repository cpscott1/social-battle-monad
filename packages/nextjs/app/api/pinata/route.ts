import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper function to generate random number between min and max
const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate base stats for NFT (range 5-20)
const generateBaseStats = () => {
  return {
    strength: randomBetween(5, 20),
    agility: randomBetween(5, 20),
    vitality: randomBetween(5, 20),
  };
};

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
    console.log("Image uploaded to IPFS successfully");

    if (!uploadResponse.IpfsHash) {
      throw new Error("Failed to get IPFS hash");
    }

    // Generate unique base stats for this NFT
    const baseStats = generateBaseStats();

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
        {
          trait_type: "Strength",
          value: baseStats.strength.toString(),
        },
        {
          trait_type: "Agility",
          value: baseStats.agility.toString(),
        },
        {
          trait_type: "Vitality",
          value: baseStats.vitality.toString(),
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
    console.log("Metadata uploaded to IPFS successfully");

    return NextResponse.json({
      success: true,
      tokenUri: `ipfs://${metadataResponse.IpfsHash}`,
      imageUrl: `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${uploadResponse.IpfsHash}`,
    });
  } catch (error) {
    console.error("Error uploading to IPFS:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error uploading to Pinata" },
      { status: 500 },
    );
  }
}
