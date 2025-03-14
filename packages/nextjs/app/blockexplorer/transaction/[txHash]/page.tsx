import TransactionComp from "../../transaction/_components/TransactionComp";
import { Hash } from "viem";
import { isZeroAddress } from "~~/utils/scaffold-eth/common";

type PageProps = {
  params: Promise<{ txHash?: Hash }>;
};

export function generateStaticParams() {
  // A workaround to enable static exports in Next.js, generating a single dummy page.
  return [{ txHash: "0x0000000000000000000000000000000000000000" }];
}

export default async function Page({ params }: PageProps) {
  const { txHash } = await params;

  if (!txHash || isZeroAddress(txHash)) return null;

  return <TransactionComp txHash={txHash} />;
}
