// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HPVForum is Ownable {
    struct Post {
        bytes32 id;
        address author;
        string cid;
        uint256 createdAt;
        uint256 upvotes;
        bool exists;
    }

    mapping(bytes32 => Post) public posts;
    mapping(bytes32 => mapping(address => bool)) public hasUpvoted;
    mapping(address => uint256) public userUpvotes;

    bytes32[] public postIds;

    event PostCreated(bytes32 indexed postId, address indexed author, string cid, uint256 timestamp);
    event PostUpvoted(bytes32 indexed postId, address indexed voter, uint256 newUpvoteCount);

    constructor() Ownable(msg.sender) {}

    function createPost(bytes32 postId, string calldata cid) external {
        require(!posts[postId].exists, "Post already exists");
        require(bytes(cid).length > 0, "CID cannot be empty");

        posts[postId] = Post({
            id: postId,
            author: msg.sender,
            cid: cid,
            createdAt: block.timestamp,
            upvotes: 0,
            exists: true
        });

        postIds.push(postId);

        emit PostCreated(postId, msg.sender, cid, block.timestamp);
    }

    function upvote(bytes32 postId) external {
        require(posts[postId].exists, "Post does not exist");
        require(!hasUpvoted[postId][msg.sender], "Already upvoted");
        require(posts[postId].author != msg.sender, "Cannot upvote own post");

        hasUpvoted[postId][msg.sender] = true;
        posts[postId].upvotes++;
        userUpvotes[msg.sender]++;

        emit PostUpvoted(postId, msg.sender, posts[postId].upvotes);
    }

    function getPost(bytes32 postId) external view returns (Post memory) {
        require(posts[postId].exists, "Post does not exist");
        return posts[postId];
    }

    function getAllPosts() external view returns (bytes32[] memory) {
        return postIds;
    }

    function getPostCount() external view returns (uint256) {
        return postIds.length;
    }

    function hasUserUpvoted(bytes32 postId, address user) external view returns (bool) {
        return hasUpvoted[postId][user];
    }
}