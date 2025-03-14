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

interface PageProps {
  params: {
    address: string;
  };
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

  const buildInfoDirectory = path.join(
    process.cwd(), // Ensures correct path resolution in Next.js
    "hardhat",
    "artifacts",
    "build-info",
  );

  if (!fs.existsSync(buildInfoDirectory)) {
    throw new Error(`Directory ${buildInfoDirectory} not found.`);
  }

  const deployedContractsOnChain = contracts ? contracts[chainId] : {};
  for (const [contractName, contractInfo] of Object.entries(deployedContractsOnChain)) {
    if (contractInfo.address.toLowerCase() === address.toLowerCase()) {
      contractPath = `contracts/${contractName}.sol`;
      break;
    }
  }

  if (!contractPath) {
    return null; // No contract found at this address
  }

  const { bytecode, assembly } = await fetchByteCodeAndAssembly(buildInfoDirectory, contractPath);
  return { bytecode, assembly };
};

export async function generateStaticParams(): Promise<{ address: string }[]> {
  return [{ address: "0x0000000000000000000000000000000000000000" }];
}

export default async function Page({ params }: PageProps) {
  const { address } = params;

  if (isZeroAddress(address)) return null;

  try {
    const contractData = await getContractData(address);
    return <AddressComponent address={address} contractData={contractData} />;
  } catch (error) {
    console.error("Error fetching contract data:", error);
    return <AddressComponent address={address} contractData={null} />;
  }
}
