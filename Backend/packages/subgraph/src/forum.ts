import { BigInt } from "@graphprotocol/graph-ts";
import {
  PostCreated,
  PostUpvoted
} from "../generated/HPVForum/HPVForum";
import { Post, Upvote, Guardian, GlobalStats } from "../generated/schema";

export function handlePostCreated(event: PostCreated): void {
  let post = new Post(event.params.postId.toHex());
  post.authorAddress = event.params.author;
  post.cid = event.params.cid;
  post.createdAt = event.params.timestamp;
  post.upvotes = 0;

  // Check if author is a guardian
  let guardian = Guardian.load(event.params.author.toHex());
  if (guardian != null) {
    post.author = guardian.id;
  }

  post.save();
  updateGlobalStats();
}

export function handlePostUpvoted(event: PostUpvoted): void {
  let upvote = new Upvote(
    event.params.postId.toHex() + "-" + event.params.voter.toHex()
  );
  upvote.post = event.params.postId.toHex();
  upvote.voterAddress = event.params.voter;
  upvote.timestamp = event.params.timestamp;

  // Check if voter is a guardian
  let guardian = Guardian.load(event.params.voter.toHex());
  if (guardian != null) {
    upvote.voter = guardian.id;
  }

  upvote.save();

  // Update post upvote count
  let post = Post.load(event.params.postId.toHex());
  if (post != null) {
    post.upvotes = post.upvotes + 1;
    post.save();
  }

  updateGlobalStats();
}

function updateGlobalStats(): void {
  let stats = GlobalStats.load("global");
  if (stats == null) {
    stats = new GlobalStats("global");
    stats.totalGuardians = 0;
    stats.totalPosts = 0;
    stats.totalUpvotes = 0;
    stats.totalRewards = BigInt.fromI32(0);
  }

  stats.lastUpdated = BigInt.fromI32(0); // Would use block timestamp
  stats.save();
}