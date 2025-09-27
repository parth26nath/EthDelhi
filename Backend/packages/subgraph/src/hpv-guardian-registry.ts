import { GuardianNFTMinted, ChipVerified } from "../generated/HPVGuardianRegistry/HPVGuardianRegistry"
import { Guardian, GlobalStats } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

export function handleGuardianNFTMinted(event: GuardianNFTMinted): void {
  let guardian = new Guardian(event.params.wallet.toHexString())

  guardian.wallet = event.params.wallet
  guardian.chipId = event.params.chipId
  guardian.tokenId = event.params.tokenId
  guardian.timestamp = event.block.timestamp

  guardian.save()

  // Update global stats
  let stats = GlobalStats.load("global")
  if (stats == null) {
    stats = new GlobalStats("global")
    stats.totalGuardians = BigInt.fromI32(0)
    stats.totalPosts = BigInt.fromI32(0)
    stats.totalUpvotes = BigInt.fromI32(0)
    stats.totalRewards = BigInt.fromI32(0)
  }

  stats.totalGuardians = stats.totalGuardians.plus(BigInt.fromI32(1))
  stats.save()
}

export function handleChipVerified(event: ChipVerified): void {
  // This event is emitted when a chip is verified by a clinic
  // We don't create entities here, just log the verification
}