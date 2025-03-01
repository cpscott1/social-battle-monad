import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the SocialBattleNFT contract
 */
const deployNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const socialBattleNFT = await deploy("SocialBattleNFT", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("SocialBattleNFT deployed to:", socialBattleNFT.address);
};

export default deployNFT;
deployNFT.tags = ["SocialBattleNFT"]; 