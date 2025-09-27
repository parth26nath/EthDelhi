// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HPVForum is Ownable {
    // Events
    event PostCreated(bytes32 indexed postId, address indexed author, string cid, uint256 timestamp);
    event PostUpvoted(bytes32 indexed postId, address indexed voter, uint256 timestamp);

    // Structs
    struct Post {
        address author;
        string cid;
        uint256 timestamp;
        uint256 upvotes;
        bool exists;
    }

    // State variables
    mapping(bytes32 => Post) public posts;
    mapping(bytes32 => mapping(address => bool)) public hasUpvoted;
    bytes32[] public postIds;

    constructor() Ownable(msg.sender) {}

    // Create a new post
    function createPost(bytes32 postId, string memory cid) external {
        require(!posts[postId].exists, "Post already exists");
        require(bytes(cid).length > 0, "CID cannot be empty");

        posts[postId] = Post({
            author: msg.sender,
            cid: cid,
            timestamp: block.timestamp,
            upvotes: 0,
            exists: true
        });

        postIds.push(postId);
        emit PostCreated(postId, msg.sender, cid, block.timestamp);
    }

    // Upvote a post (one per wallet)
    function upvote(bytes32 postId) external {
        require(posts[postId].exists, "Post does not exist");
        require(!hasUpvoted[postId][msg.sender], "Already upvoted");

        hasUpvoted[postId][msg.sender] = true;
        posts[postId].upvotes++;

        emit PostUpvoted(postId, msg.sender, block.timestamp);
    }

    // Get post details
    function getPost(bytes32 postId) external view returns (
        address author,
        string memory cid,
        uint256 timestamp,
        uint256 upvotes
    ) {
        require(posts[postId].exists, "Post does not exist");
        Post memory post = posts[postId];
        return (post.author, post.cid, post.timestamp, post.upvotes);
    }

    // Get all post IDs
    function getAllPostIds() external view returns (bytes32[] memory) {
        return postIds;
    }

    // Get total number of posts
    function getTotalPosts() external view returns (uint256) {
        return postIds.length;
    }

    // Check if user has upvoted a post
    function hasUserUpvoted(bytes32 postId, address user) external view returns (bool) {
        return hasUpvoted[postId][user];
    }

    // Get posts by author (for analytics)
    function getPostsByAuthor(address author) external view returns (bytes32[] memory) {
        bytes32[] memory authorPosts = new bytes32[](postIds.length);
        uint256 count = 0;

        for (uint256 i = 0; i < postIds.length; i++) {
            if (posts[postIds[i]].author == author) {
                authorPosts[count] = postIds[i];
                count++;
            }
        }

        // Resize array to actual count
        bytes32[] memory result = new bytes32[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = authorPosts[i];
        }

        return result;
    }
}