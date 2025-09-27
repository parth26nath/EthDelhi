import { PostCreated, PostUpvoted } from "../generated/HPVForum/HPVForum"
import { Post, Upvote, Guardian, GlobalStats } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

export function handlePostCreated(event: PostCreated): void {
  let post = new Post(event.params.postId.toHexString())

  post.authorAddress = event.params.author
  post.cid = event.params.cid
  post.createdAt = event.block.timestamp
  post.upvoteCount = BigInt.fromI32(0)

  // Link to Guardian if exists
  let guardian = Guardian.load(event.params.author.toHexString())
  if (guardian != null) {
    post.author = guardian.id
  }

  post.save()

  // Update global stats
  let stats = GlobalStats.load("global")
  if (stats == null) {
    stats = new GlobalStats("global")
    stats.totalGuardians = BigInt.fromI32(0)
    stats.totalPosts = BigInt.fromI32(0)
    stats.totalUpvotes = BigInt.fromI32(0)
    stats.totalRewards = BigInt.fromI32(0)
  }

  stats.totalPosts = stats.totalPosts.plus(BigInt.fromI32(1))
  stats.save()
}

export function handlePostUpvoted(event: PostUpvoted): void {
  let upvoteId = event.params.postId.toHexString() + "-" + event.params.voter.toHexString()
  let upvote = new Upvote(upvoteId)

  upvote.post = event.params.postId.toHexString()
  upvote.voterAddress = event.params.voter
  upvote.timestamp = event.block.timestamp

  // Link to Guardian if exists
  let guardian = Guardian.load(event.params.voter.toHexString())
  if (guardian != null) {
    upvote.voter = guardian.id
  }

  upvote.save()

  // Update post upvote count
  let post = Post.load(event.params.postId.toHexString())
  if (post != null) {
    post.upvoteCount = event.params.newUpvoteCount
    post.save()
  }

  // Update global stats
  let stats = GlobalStats.load("global")
  if (stats == null) {
    stats = new GlobalStats("global")
    stats.totalGuardians = BigInt.fromI32(0)
    stats.totalPosts = BigInt.fromI32(0)
    stats.totalUpvotes = BigInt.fromI32(0)
    stats.totalRewards = BigInt.fromI32(0)
  }

  stats.totalUpvotes = stats.totalUpvotes.plus(BigInt.fromI32(1))
  stats.save()
}