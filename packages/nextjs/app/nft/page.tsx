import { NFTDisplay } from "~~/components/nft/NFTDisplay";

export default function NFTPage() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 max-w-[1024px] mx-auto">
      <h1 className="text-4xl font-bold mb-8">Social Battle NFTs</h1>
      <NFTDisplay />
    </div>
  );
}
