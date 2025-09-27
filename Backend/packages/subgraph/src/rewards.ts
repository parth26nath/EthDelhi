import { BigInt } from "@graphprotocol/graph-ts";
import { RewardAllocated } from "../generated/HPVRewards/HPVRewards";
import { Reward, Guardian, GlobalStats } from "../generated/schema";

export function handleRewardAllocated(event: RewardAllocated): void {
  let reward = new Reward(
    event.params.recipient.toHex() + "-" + event.params.timestamp.toString()
  );
  reward.recipientAddress = event.params.recipient;
  reward.amount = event.params.amount;
  reward.timestamp = event.params.timestamp;

  // Check if recipient is a guardian
  let guardian = Guardian.load(event.params.recipient.toHex());
  if (guardian != null) {
    reward.recipient = guardian.id;
  }

  reward.save();
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