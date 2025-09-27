import { RewardAllocated } from "../generated/HPVRewards/HPVRewards"
import { Reward, Guardian, GlobalStats } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

export function handleRewardAllocated(event: RewardAllocated): void {
  let reward = new Reward(event.params.allocationId.toString())

  reward.recipientAddress = event.params.recipient
  reward.amount = event.params.amount
  reward.timestamp = event.params.timestamp
  reward.allocationId = event.params.allocationId

  // Link to Guardian if exists
  let guardian = Guardian.load(event.params.recipient.toHexString())
  if (guardian != null) {
    reward.recipient = guardian.id
  }

  reward.save()

  // Update global stats
  let stats = GlobalStats.load("global")
  if (stats == null) {
    stats = new GlobalStats("global")
    stats.totalGuardians = BigInt.fromI32(0)
    stats.totalPosts = BigInt.fromI32(0)
    stats.totalUpvotes = BigInt.fromI32(0)
    stats.totalRewards = BigInt.fromI32(0)
  }

  stats.totalRewards = stats.totalRewards.plus(event.params.amount)
  stats.save()
}