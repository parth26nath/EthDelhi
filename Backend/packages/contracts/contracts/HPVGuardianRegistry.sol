// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HPVGuardianRegistry is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    mapping(address => bool) public authorizedClinics;
    mapping(bytes32 => bool) public verifiedChips;
    mapping(bytes32 => address) public chipToWallet;
    mapping(address => bytes32) public walletToChip;
    mapping(bytes32 => address) public chipToClinic;

    event ChipVerified(bytes32 indexed chipId, address indexed clinic, uint256 timestamp);
    event GuardianNFTMinted(address indexed wallet, bytes32 indexed chipId, uint256 tokenId);
    event ClinicRegistered(address indexed clinic);

    constructor() ERC721("HPV Guardian", "HPVG") Ownable(msg.sender) {}

    function registerClinic(address clinic) external onlyOwner {
        authorizedClinics[clinic] = true;
        emit ClinicRegistered(clinic);
    }

    function registerVaccination(bytes32 chipId, bytes calldata clinicSig) external {
        require(authorizedClinics[msg.sender], "Not authorized clinic");
        require(!verifiedChips[chipId], "Chip already verified");

        verifiedChips[chipId] = true;
        chipToClinic[chipId] = msg.sender;

        emit ChipVerified(chipId, msg.sender, block.timestamp);
    }

    function becomeGuardian(bytes32 chipId, bytes calldata zkProof) external {
        require(verifiedChips[chipId], "Chip not verified");
        require(chipToWallet[chipId] == address(0), "Chip already bound");
        require(walletToChip[msg.sender] == bytes32(0), "Wallet already has chip");

        // In production, verify zkProof with Self Protocol
        require(_verifySelfProof(zkProof), "Invalid ZK proof");

        chipToWallet[chipId] = msg.sender;
        walletToChip[msg.sender] = chipId;

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);

        emit GuardianNFTMinted(msg.sender, chipId, tokenId);
    }

    function _verifySelfProof(bytes calldata zkProof) internal pure returns (bool) {
        // Mock verification for demo - always returns true
        // In production, integrate with Self Protocol SDK
        return zkProof.length > 0;
    }

    function isGuardian(address wallet) external view returns (bool) {
        return balanceOf(wallet) > 0;
    }

    function getChipId(address wallet) external view returns (bytes32) {
        return walletToChip[wallet];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        return string(abi.encodePacked(
            "data:application/json;base64,",
            "eyJuYW1lIjogIkhQViBHdWFyZGlhbiIsICJkZXNjcmlwdGlvbiI6ICJWZXJpZmllZCBIUFYgVmFjY2luYXRpb24gR3VhcmRpYW4iLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCM2FXUjBhRDBpTWpBd0lpQm9aV2xuYUhROUlqSXdNQ0lnZG1sbGQwSnZlRDBpTUNBd0lESXdNQ0F5TURBSU1UUXdJQ0kyTUM0MlppSTZJR2hsZDJZd1ptUXRNMlkxWVMweE1EZzJMVGt4WmpNdE0yWXhNell6WkdJek9UWmpaU0krUEhOMGVXeGxQZ289In0="
        ));
    }
}