import fs from "fs";
import { Metadata } from "next";
import path from "path";
import { hardhat } from "viem/chains";
import { AddressComponent } from "~~/app/blockexplorer/_components/AddressComponent";
import deployedContracts from "~~/contracts/deployedContracts";
import { isZeroAddress } from "~~/utils/scaffold-eth/common";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

export const metadata: Metadata = {
  title: "Block Explorer",
};

// ✅ Adjusted params to be a Promise-based object for Next.js 15+
export default async function Page({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params; // ✅ Awaiting params since it's now a Promise

  if (!address || isZeroAddress(address)) return null;

  try {
    const contractData = await getContractData(address);
    return <AddressComponent address={address} contractData={contractData} />;
  } catch (error) {
    console.error("Error fetching contract data:", error);
    return <AddressComponent address={address} contractData={null} />;
  }
}

async function fetchByteCodeAndAssembly(buildInfoDirectory: string, contractPath: string) {
  const buildInfoFiles = fs.readdirSync(buildInfoDirectory);
  let bytecode = "";
  let assembly = "";

  for (const file of buildInfoFiles) {
    const filePath = path.join(buildInfoDirectory, file);
    const buildInfo = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (buildInfo.output.contracts[contractPath]) {
      for (const contract in buildInfo.output.contracts[contractPath]) {
        bytecode = buildInfo.output.contracts[contractPath][contract].evm.bytecode.object;
        assembly = buildInfo.output.contracts[contractPath][contract].evm.bytecode.opcodes;
        break;
      }
    }

    if (bytecode && assembly) break;
  }

  return { bytecode, assembly };
}

const getContractData = async (address: string) => {
  const contracts = deployedContracts as GenericContractsDeclaration | null;
  const chainId = hardhat.id;
  let contractPath = "";

  const buildInfoDirectory = path.join(process.cwd(), "hardhat", "artifacts", "build-info");

  if (!fs.existsSync(buildInfoDirectory)) {
    console.error(`Directory ${buildInfoDirectory} not found.`);
    return null;
  }

  const deployedContractsOnChain = contracts ? contracts[chainId] : {};
  for (const [contractName, contractInfo] of Object.entries(deployedContractsOnChain)) {
    if (contractInfo.address.toLowerCase() === address.toLowerCase()) {
      contractPath = `contracts/${contractName}.sol`;
      break;
    }
  }

  if (!contractPath) {
    return null;
  }

  return await fetchByteCodeAndAssembly(buildInfoDirectory, contractPath);
};

// ✅ Ensure `generateStaticParams` correctly returns an array of params
export async function generateStaticParams(): Promise<{ address: string }[]> {
  return [{ address: "0x0000000000000000000000000000000000000000" }];
}
