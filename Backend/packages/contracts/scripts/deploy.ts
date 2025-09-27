import { ethers } from "hardhat";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy HPVGuardianRegistry
  console.log("\nDeploying HPVGuardianRegistry...");
  const HPVGuardianRegistry = await ethers.getContractFactory("HPVGuardianRegistry");
  const guardianRegistry = await HPVGuardianRegistry.deploy();
  await guardianRegistry.waitForDeployment();
  const guardianRegistryAddress = await guardianRegistry.getAddress();
  console.log("HPVGuardianRegistry deployed to:", guardianRegistryAddress);

  // Deploy HPVForum
  console.log("\nDeploying HPVForum...");
  const HPVForum = await ethers.getContractFactory("HPVForum");
  const forum = await HPVForum.deploy();
  await forum.waitForDeployment();
  const forumAddress = await forum.getAddress();
  console.log("HPVForum deployed to:", forumAddress);

  // Deploy HPVRewards
  console.log("\nDeploying HPVRewards...");
  const HPVRewards = await ethers.getContractFactory("HPVRewards");
  const rewards = await HPVRewards.deploy();
  await rewards.waitForDeployment();
  const rewardsAddress = await rewards.getAddress();
  console.log("HPVRewards deployed to:", rewardsAddress);

  // Register deployer as authorized clinic for demo
  console.log("\nRegistering deployer as authorized clinic...");
  await guardianRegistry.registerClinic(deployer.address);
  console.log("Deployer registered as authorized clinic");

  // Fund rewards contract for demo
  console.log("\nFunding rewards contract...");
  await deployer.sendTransaction({
    to: rewardsAddress,
    value: ethers.parseEther("1.0")
  });
  console.log("Rewards contract funded with 1 ETH");

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      HPVGuardianRegistry: guardianRegistryAddress,
      HPVForum: forumAddress,
      HPVRewards: rewardsAddress
    },
    timestamp: new Date().toISOString()
  };

  // Create shared directory if it doesn't exist
  const sharedDir = join(__dirname, "../../shared");
  try {
    mkdirSync(sharedDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }

  // Write addresses to shared package
  writeFileSync(
    join(sharedDir, "addresses.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment completed!");
  console.log("Deployment info saved to packages/shared/addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });