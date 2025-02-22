"use client";

import type { NextPage } from "next";
import { BoltIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const NFTIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    {...props}
  >
    <path d="M20 4L12 8L4 4L12 0L20 4Z" fill="currentColor"/>
    <path d="M20 8L12 12L4 8V4L12 8L20 4V8Z" fill="currentColor"/>
    <path d="M20 12L12 16L4 12V8L12 12L20 8V12Z" fill="currentColor"/>
    <path d="M20 16L12 20L4 16V12L12 16L20 12V16Z" fill="currentColor"/>
    <path d="M20 20L12 24L4 20V16L12 20L20 16V20Z" fill="currentColor"/>
  </svg>
);

const BattleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    {...props}
  >
    <path d="M14.5 4L17 2L19.5 4L17 6L14.5 4Z" fill="currentColor"/>
    <path d="M4.5 14L7 12L9.5 14L7 16L4.5 14Z" fill="currentColor"/>
    <path d="M19.5 19.5L17 17.5L14.5 19.5L17 21.5L19.5 19.5Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M17 6L19.5 4L22 6.5L19.5 8.5L17 6ZM7 16L9.5 14L12 16.5L9.5 18.5L7 16ZM17 21.5L19.5 19.5L22 22L19.5 24L17 21.5Z" fill="currentColor"/>
    <path d="M2 2L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MarketplaceIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    {...props}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M3 2C2.44772 2 2 2.44772 2 3V21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21V3C22 2.44772 21.5523 2 21 2H3ZM4 20V4H20V20H4Z" fill="currentColor"/>
    <path d="M7 7H17V9H7V7Z" fill="currentColor"/>
    <path d="M7 11H17V13H7V11Z" fill="currentColor"/>
    <path d="M7 15H13V17H7V15Z" fill="currentColor"/>
    <circle cx="17" cy="16" r="2" fill="currentColor"/>
  </svg>
);

const Home: NextPage = () => {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen">
      <div className="flex items-center flex-col flex-grow pt-10 container mx-auto px-4">
        <div className="px-5 text-center">
          <h1 className="text-5xl md:text-7xl mb-4 font-bold bg-gradient-to-r from-[#00E0FF] to-[#3CFF97] text-transparent bg-clip-text leading-tight">
            Social Gaming Evolved
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Join the next generation of social gaming where your influence becomes your power
          </p>
          <div className="flex justify-center gap-4">
            {!isConnected ? (
              <RainbowKitCustomConnectButton />
            ) : (
              <button 
                className="px-6 py-3 bg-[#3CFF97] text-black rounded-lg font-semibold transition-all hover:bg-opacity-90 focus:ring-2 focus:ring-[#3CFF97] focus:ring-opacity-50 focus:outline-none"
                onClick={() => console.log('Get Started clicked')}
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        <section className="w-full mt-32 px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#00E0FF]">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-opacity-20 bg-purple-900 rounded-xl p-8 backdrop-blur-sm border border-purple-800 transition-all hover:bg-opacity-30">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00E0FF] to-[#3CFF97] rounded-lg flex items-center justify-center mb-4">
                <NFTIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">NFT Avatars</h3>
              <p className="text-gray-400">Create and evolve unique NFT avatars that reflect your social status</p>
            </div>
            
            <div className="bg-opacity-20 bg-purple-900 rounded-xl p-8 backdrop-blur-sm border border-purple-800 transition-all hover:bg-opacity-30">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00E0FF] to-[#3CFF97] rounded-lg flex items-center justify-center mb-4">
                <BoltIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Social XP</h3>
              <p className="text-gray-400">Earn XP through community engagement and level up your profile</p>
            </div>

            <div className="bg-opacity-20 bg-purple-900 rounded-xl p-8 backdrop-blur-sm border border-purple-800 transition-all hover:bg-opacity-30">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00E0FF] to-[#3CFF97] rounded-lg flex items-center justify-center mb-4">
                <BattleIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Battle Arena</h3>
              <p className="text-gray-400">Engage in strategic turn-based battles with other players</p>
            </div>

            <div className="bg-opacity-20 bg-purple-900 rounded-xl p-8 backdrop-blur-sm border border-purple-800 transition-all hover:bg-opacity-30">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00E0FF] to-[#3CFF97] rounded-lg flex items-center justify-center mb-4">
                <MarketplaceIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Marketplace</h3>
              <p className="text-gray-400">Trade NFTs in our dedicated marketplace with other players</p>
            </div>
          </div>
        </section>

        <section className="w-full mt-32 mb-20 px-8">
          <div className="max-w-4xl mx-auto bg-opacity-20 bg-purple-900 rounded-3xl p-12 backdrop-blur-sm border border-purple-800">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">Ready to Start Your Journey?</h2>
            <p className="text-center text-gray-300 mb-8">Join thousands of players already battling in the arena</p>
            <div className="flex justify-center">
              <button 
                className="px-6 py-3 bg-[#3CFF97] text-black rounded-lg font-semibold transition-all hover:bg-opacity-90 focus:ring-2 focus:ring-[#3CFF97] focus:ring-opacity-50 focus:outline-none"
                onClick={() => console.log('Create Account clicked')}
              >
                Create Your Account
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
