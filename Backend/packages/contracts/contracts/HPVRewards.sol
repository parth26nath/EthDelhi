// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HPVRewards is Ownable, ReentrancyGuard {
    struct RewardAllocation {
        address recipient;
        uint256 amount;
        uint256 timestamp;
        bool claimed;
    }

    mapping(address => uint256) public totalAllocated;
    mapping(address => uint256) public totalClaimed;
    mapping(address => RewardAllocation[]) public userAllocations;

    RewardAllocation[] public allAllocations;

    event RewardAllocated(address indexed recipient, uint256 amount, uint256 timestamp, uint256 allocationId);
    event RewardClaimed(address indexed recipient, uint256 amount, uint256 allocationId);

    constructor() Ownable(msg.sender) {}

    function allocateRewards(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "No recipients provided");

        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            uint256 amount = amounts[i];

            require(recipient != address(0), "Invalid recipient");
            require(amount > 0, "Amount must be greater than 0");

            RewardAllocation memory allocation = RewardAllocation({
                recipient: recipient,
                amount: amount,
                timestamp: block.timestamp,
                claimed: false
            });

            userAllocations[recipient].push(allocation);
            allAllocations.push(allocation);
            totalAllocated[recipient] += amount;

            emit RewardAllocated(recipient, amount, block.timestamp, allAllocations.length - 1);
        }
    }

    function claim(uint256 allocationId) external nonReentrant {
        require(allocationId < allAllocations.length, "Invalid allocation ID");

        RewardAllocation storage allocation = allAllocations[allocationId];
        require(allocation.recipient == msg.sender, "Not your allocation");
        require(!allocation.claimed, "Already claimed");
        require(address(this).balance >= allocation.amount, "Insufficient contract balance");

        allocation.claimed = true;
        totalClaimed[msg.sender] += allocation.amount;

        payable(msg.sender).transfer(allocation.amount);

        emit RewardClaimed(msg.sender, allocation.amount, allocationId);
    }

    function claimAll() external nonReentrant {
        uint256 totalToClaim = 0;

        for (uint256 i = 0; i < userAllocations[msg.sender].length; i++) {
            if (!userAllocations[msg.sender][i].claimed) {
                totalToClaim += userAllocations[msg.sender][i].amount;
                userAllocations[msg.sender][i].claimed = true;
            }
        }

        require(totalToClaim > 0, "No rewards to claim");
        require(address(this).balance >= totalToClaim, "Insufficient contract balance");

        totalClaimed[msg.sender] += totalToClaim;
        payable(msg.sender).transfer(totalToClaim);
    }

    function getUserAllocations(address user) external view returns (RewardAllocation[] memory) {
        return userAllocations[user];
    }

    function getAllAllocations() external view returns (RewardAllocation[] memory) {
        return allAllocations;
    }

    function getUnclaimedAmount(address user) external view returns (uint256) {
        uint256 unclaimed = 0;
        for (uint256 i = 0; i < userAllocations[user].length; i++) {
            if (!userAllocations[user][i].claimed) {
                unclaimed += userAllocations[user][i].amount;
            }
        }
        return unclaimed;
    }

    function getTotalAllocations() external view returns (uint256) {
        return allAllocations.length;
    }

    receive() external payable {}

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}