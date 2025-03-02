import type { NextPage } from "next";
import { NFTCard } from "~~/components/nft/NFTCard";

const NFTDemo: NextPage = () => {
  const demoNFT = {
    name: "Cyber Samurai",
    image: "https://picsum.photos/400/400", // Placeholder image
    stats: {
      attack: 85,
      defense: 70,
      agility: 75,
      intelligence: 65,
    },
    description: "A legendary warrior from the cyber realm, skilled in both ancient combat and future tech.",
    rarity: "Legendary",
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8 bg-gradient-to-b from-[#2D2D2D] to-[#1B1B1B]">
      <h1 className="text-4xl font-bold text-white mb-8">NFT Trading Card</h1>
      <NFTCard {...demoNFT} />
    </div>
  );
};

export default NFTDemo;
