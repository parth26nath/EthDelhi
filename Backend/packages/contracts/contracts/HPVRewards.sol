// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HPVRewards is Ownable, ReentrancyGuard {
    // Events
    event RewardAllocated(address indexed recipient, uint256 amount, uint256 timestamp);
    event RewardClaimed(address indexed recipient, uint256 amount, uint256 timestamp);

    // Structs
    struct Reward {
        uint256 amount;
        bool claimed;
        uint256 timestamp;
    }

    // State variables
    mapping(address => Reward[]) public rewards;
    mapping(address => uint256) public totalAllocated;
    mapping(address => uint256) public totalClaimed;

    uint256 public totalRewardsPool;

    constructor() Ownable(msg.sender) {}

    // Receive ETH donations to the rewards pool
    receive() external payable {
        totalRewardsPool += msg.value;
    }

    // Allocate rewards to multiple recipients (batch operation)
    function allocateRewards(
        address[] memory recipients,
        uint256[] memory amounts
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "No recipients provided");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            require(amounts[i] > 0, "Invalid amount");

            rewards[recipients[i]].push(Reward({
                amount: amounts[i],
                claimed: false,
                timestamp: block.timestamp
            }));

            totalAllocated[recipients[i]] += amounts[i];
            emit RewardAllocated(recipients[i], amounts[i], block.timestamp);
        }
    }

    // Allocate reward to a single recipient
    function allocateReward(address recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Invalid amount");

        rewards[recipient].push(Reward({
            amount: amount,
            claimed: false,
            timestamp: block.timestamp
        }));

        totalAllocated[recipient] += amount;
        emit RewardAllocated(recipient, amount, block.timestamp);
    }

    // Claim all unclaimed rewards
    function claimRewards() external nonReentrant {
        uint256 totalToClaim = 0;
        Reward[] storage userRewards = rewards[msg.sender];

        // Calculate total unclaimed amount
        for (uint256 i = 0; i < userRewards.length; i++) {
            if (!userRewards[i].claimed) {
                totalToClaim += userRewards[i].amount;
                userRewards[i].claimed = true;
            }
        }

        require(totalToClaim > 0, "No rewards to claim");
        require(address(this).balance >= totalToClaim, "Insufficient contract balance");

        totalClaimed[msg.sender] += totalToClaim;

        // Transfer ETH to recipient
        (bool success, ) = msg.sender.call{value: totalToClaim}("");
        require(success, "Transfer failed");

        emit RewardClaimed(msg.sender, totalToClaim, block.timestamp);
    }

    // Get user's reward history
    function getUserRewards(address user) external view returns (
        uint256[] memory amounts,
        bool[] memory claimed,
        uint256[] memory timestamps
    ) {
        Reward[] memory userRewards = rewards[user];
        uint256 length = userRewards.length;

        amounts = new uint256[](length);
        claimed = new bool[](length);
        timestamps = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            amounts[i] = userRewards[i].amount;
            claimed[i] = userRewards[i].claimed;
            timestamps[i] = userRewards[i].timestamp;
        }
    }

    // Get unclaimed reward amount for a user
    function getUnclaimedAmount(address user) external view returns (uint256) {
        uint256 unclaimed = 0;
        Reward[] memory userRewards = rewards[user];

        for (uint256 i = 0; i < userRewards.length; i++) {
            if (!userRewards[i].claimed) {
                unclaimed += userRewards[i].amount;
            }
        }

        return unclaimed;
    }

    // Get total rewards allocated to a user
    function getTotalAllocated(address user) external view returns (uint256) {
        return totalAllocated[user];
    }

    // Get total rewards claimed by a user
    function getTotalClaimed(address user) external view returns (uint256) {
        return totalClaimed[user];
    }

    // Get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Owner can withdraw excess funds
    function withdrawExcess(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");

        (bool success, ) = owner().call{value: amount}("");
        require(success, "Transfer failed");
    }

    // Emergency function to pause claims (if needed)
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
    }
}