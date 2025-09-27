import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Deploying HPV Warriors DAO contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Deploy HPVGuardianRegistry
  console.log("\n📋 Deploying HPVGuardianRegistry...");
  const HPVGuardianRegistry = await ethers.getContractFactory("HPVGuardianRegistry");
  const guardianRegistry = await HPVGuardianRegistry.deploy();
  await guardianRegistry.waitForDeployment();
  const registryAddress = await guardianRegistry.getAddress();
  console.log("✅ HPVGuardianRegistry deployed to:", registryAddress);

  // Deploy HPVForum
  console.log("\n💬 Deploying HPVForum...");
  const HPVForum = await ethers.getContractFactory("HPVForum");
  const forum = await HPVForum.deploy();
  await forum.waitForDeployment();
  const forumAddress = await forum.getAddress();
  console.log("✅ HPVForum deployed to:", forumAddress);

  // Deploy HPVRewards
  console.log("\n🎁 Deploying HPVRewards...");
  const HPVRewards = await ethers.getContractFactory("HPVRewards");
  const rewards = await HPVRewards.deploy();
  await rewards.waitForDeployment();
  const rewardsAddress = await rewards.getAddress();
  console.log("✅ HPVRewards deployed to:", rewardsAddress);

  // Setup initial configuration
  console.log("\n⚙️ Setting up initial configuration...");

  // Register deployer as an authorized clinic for testing
  const registerTx = await guardianRegistry.registerClinic(deployer.address);
  await registerTx.wait();
  console.log("✅ Registered deployer as authorized clinic");

  // Fund rewards contract with some ETH for testing
  const fundTx = await deployer.sendTransaction({
    to: rewardsAddress,
    value: ethers.parseEther("0.1")
  });
  await fundTx.wait();
  console.log("✅ Funded rewards contract with 0.1 ETH");

  // Save contract addresses and ABIs
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      HPVGuardianRegistry: {
        address: registryAddress,
        constructorArgs: []
      },
      HPVForum: {
        address: forumAddress,
        constructorArgs: []
      },
      HPVRewards: {
        address: rewardsAddress,
        constructorArgs: []
      }
    }
  };

  // Ensure shared directory exists
  const sharedDir = path.resolve(__dirname, "../../shared");
  if (!fs.existsSync(sharedDir)) {
    fs.mkdirSync(sharedDir, { recursive: true });
  }

  // Write addresses file
  const addressesPath = path.resolve(sharedDir, "addresses.json");
  fs.writeFileSync(addressesPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("✅ Contract addresses saved to:", addressesPath);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("HPVGuardianRegistry:", registryAddress);
  console.log("HPVForum:", forumAddress);
  console.log("HPVRewards:", rewardsAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });