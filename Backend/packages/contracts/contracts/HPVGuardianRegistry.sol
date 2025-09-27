// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract HPVGuardianRegistry is ERC721, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Events
    event ChipVerified(bytes32 indexed chipId, address indexed clinic, uint256 timestamp);
    event GuardianNFTMinted(address indexed guardian, bytes32 indexed chipId, uint256 tokenId);
    event ClinicRegistered(address indexed clinic);

    // State variables
    mapping(address => bool) public authorizedClinics;
    mapping(bytes32 => bool) public verifiedChips;
    mapping(bytes32 => address) public chipToGuardian;
    mapping(address => bytes32) public guardianToChip;

    uint256 private _nextTokenId = 1;

    constructor() ERC721("HPV Guardian", "HPVG") Ownable(msg.sender) {}

    // Register a clinic that can verify vaccinations
    function registerClinic(address clinic) external onlyOwner {
        require(clinic != address(0), "Invalid clinic address");
        authorizedClinics[clinic] = true;
        emit ClinicRegistered(clinic);
    }

    // Clinic registers a vaccination for a specific chip
    function registerVaccination(bytes32 chipId, bytes memory clinicSig) external {
        require(authorizedClinics[msg.sender], "Not authorized clinic");
        require(!verifiedChips[chipId], "Chip already verified");

        // Verify clinic signature (simplified for demo)
        bytes32 messageHash = keccak256(abi.encodePacked(chipId, msg.sender)).toEthSignedMessageHash();
        address signer = messageHash.recover(clinicSig);
        require(signer == msg.sender, "Invalid clinic signature");

        verifiedChips[chipId] = true;
        emit ChipVerified(chipId, msg.sender, block.timestamp);
    }

    // User becomes a guardian by providing chip and ZK proof
    function becomeGuardian(bytes32 chipId, bytes memory zkProof) external {
        require(verifiedChips[chipId], "Chip not verified");
        require(chipToGuardian[chipId] == address(0), "Chip already bound");
        require(guardianToChip[msg.sender] == bytes32(0), "Already a guardian");

        // Verify ZK proof (simplified for demo - in real implementation would verify via Self Protocol)
        require(_verifySelfProof(zkProof), "Invalid ZK proof");

        // Bind chip to guardian and mint NFT
        chipToGuardian[chipId] = msg.sender;
        guardianToChip[msg.sender] = chipId;

        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);

        emit GuardianNFTMinted(msg.sender, chipId, tokenId);
    }

    // Simplified ZK proof verification (mock for demo)
    function _verifySelfProof(bytes memory zkProof) internal pure returns (bool) {
        // In real implementation, this would call Self Protocol verification
        // For demo purposes, we accept any non-empty proof
        return zkProof.length > 0;
    }

    // Check if an address is a verified guardian
    function isGuardian(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }

    // Get chip ID for a guardian
    function getGuardianChip(address guardian) external view returns (bytes32) {
        return guardianToChip[guardian];
    }

    // Override tokenURI to return guardian badge metadata
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(
            "data:application/json;base64,",
            "eyJuYW1lIjoiSFBWIEd1YXJkaWFuIiwiZGVzY3JpcHRpb24iOiJWZXJpZmllZCBIUFYgVmFjY2luYXRpb24gR3VhcmRpYW4iLCJpbWFnZSI6ImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjNhV1IwYUQwaU1qQXdJaUJvWldsbmFIUTlJakl3TUNJZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWo0OGNtVmpkQ0IzYVdSMGFEMGlNakF3SWlCb1pXbG5hSFE5SWpJd01DSWdabWxzYkQwaUl6QXdOekZGUmlJZ0x6NDhkR1Y0ZENCNFBTSXhNREFpSUhrOUlqRXdNQ0lnWm1sc2JEMGlJM1ptWm1abUlpQjBaWGgwTFdGdVkyaHZjajBpYldsa1pHeGxJaUJtYjI1MExYTnBlbVU5SWpFMGNIZ2lQa2hRVmlCSGRXRnlaR2xoYmk4OWRHVjRkRDQ4TDNOMlp6ND0ifQ=="
        ));
    }
}