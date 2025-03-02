import { FC } from "react";
import Image from "next/image";

interface NFTCardProps {
  name: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export const NFTCard: FC<NFTCardProps> = ({ name, image, attributes = [] }) => {
  // Helper function to get attribute value
  const getAttributeValue = (traitType: string) => {
    const attribute = attributes.find(attr => attr.trait_type === traitType);
    return attribute ? attribute.value : "0";
  };

  return (
    <div className="relative w-[400px] bg-[#4B2094] rounded-2xl overflow-hidden p-6">
      {/* Header with Name and Level */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-white">{name}</h3>
        <div className="px-3 py-1 bg-yellow-500 rounded-full text-sm font-semibold text-black">
          Lvl {getAttributeValue("Level")}
        </div>
      </div>

      {/* Character Image */}
      <div className="relative w-full aspect-square mb-6">
        <Image
          src={image}
          alt={name}
          fill
          className="rounded-xl object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Level and XP Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#3B1875] rounded-xl p-4">
          <div className="text-gray-300 text-sm mb-1">Level</div>
          <div className="text-white text-2xl font-bold">{getAttributeValue("Level")}</div>
        </div>
        <div className="bg-[#3B1875] rounded-xl p-4">
          <div className="text-gray-300 text-sm mb-1">XP</div>
          <div className="text-white text-2xl font-bold">{getAttributeValue("XP")}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-gray-300 text-sm mb-1">Attack</div>
          <div className="text-white text-xl font-bold">{getAttributeValue("Strength")}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-300 text-sm mb-1">Defense</div>
          <div className="text-white text-xl font-bold">{getAttributeValue("Vitality")}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-300 text-sm mb-1">Agility</div>
          <div className="text-white text-xl font-bold">{getAttributeValue("Agility")}</div>
        </div>
      </div>
    </div>
  );
};
