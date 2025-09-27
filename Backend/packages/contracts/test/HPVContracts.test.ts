import { expect } from "chai";
import { ethers } from "hardhat";
import { HPVGuardianRegistry, HPVForum, HPVRewards } from "../typechain-types";

describe("HPV Warriors DAO Contracts", function () {
  let guardianRegistry: HPVGuardianRegistry;
  let forum: HPVForum;
  let rewards: HPVRewards;
  let owner: any;
  let clinic: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, clinic, user1, user2] = await ethers.getSigners();

    // Deploy contracts
    const HPVGuardianRegistry = await ethers.getContractFactory("HPVGuardianRegistry");
    guardianRegistry = await HPVGuardianRegistry.deploy();

    const HPVForum = await ethers.getContractFactory("HPVForum");
    forum = await HPVForum.deploy();

    const HPVRewards = await ethers.getContractFactory("HPVRewards");
    rewards = await HPVRewards.deploy();

    // Setup
    await guardianRegistry.registerClinic(clinic.address);
  });

  describe("HPVGuardianRegistry", function () {
    it("Should register a clinic", async function () {
      expect(await guardianRegistry.authorizedClinics(clinic.address)).to.be.true;
    });

    it("Should verify vaccination and mint guardian NFT", async function () {
      const chipId = ethers.keccak256(ethers.toUtf8Bytes("test-chip-1"));
      const messageHash = ethers.solidityPackedKeccak256(["bytes32", "address"], [chipId, clinic.address]);
      const signature = await clinic.signMessage(ethers.getBytes(messageHash));

      // Register vaccination
      await guardianRegistry.connect(clinic).registerVaccination(chipId, signature);
      expect(await guardianRegistry.verifiedChips(chipId)).to.be.true;

      // Become guardian
      const zkProof = ethers.toUtf8Bytes("mock-zk-proof");
      await guardianRegistry.connect(user1).becomeGuardian(chipId, zkProof);

      expect(await guardianRegistry.balanceOf(user1.address)).to.equal(1);
      expect(await guardianRegistry.isGuardian(user1.address)).to.be.true;
    });
  });

  describe("HPVForum", function () {
    it("Should create and upvote posts", async function () {
      const postId = ethers.keccak256(ethers.toUtf8Bytes("test-post-1"));
      const cid = "QmTestCID123";

      // Create post
      await forum.connect(user1).createPost(postId, cid);
      const post = await forum.getPost(postId);
      expect(post.author).to.equal(user1.address);
      expect(post.cid).to.equal(cid);

      // Upvote post
      await forum.connect(user2).upvote(postId);
      const updatedPost = await forum.getPost(postId);
      expect(updatedPost.upvotes).to.equal(1);
    });
  });

  describe("HPVRewards", function () {
    it("Should allocate and claim rewards", async function () {
      // Fund contract
      await owner.sendTransaction({
        to: await rewards.getAddress(),
        value: ethers.parseEther("1.0")
      });

      // Allocate rewards
      await rewards.allocateReward(user1.address, ethers.parseEther("0.1"));
      expect(await rewards.getUnclaimedAmount(user1.address)).to.equal(ethers.parseEther("0.1"));

      // Claim rewards
      const balanceBefore = await ethers.provider.getBalance(user1.address);
      await rewards.connect(user1).claimRewards();
      const balanceAfter = await ethers.provider.getBalance(user1.address);

      expect(balanceAfter > balanceBefore).to.be.true;
      expect(await rewards.getUnclaimedAmount(user1.address)).to.equal(0);
    });
  });
});