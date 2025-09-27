import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  ChipVerified,
  GuardianNFTMinted,
  ClinicRegistered
} from "../generated/HPVGuardianRegistry/HPVGuardianRegistry";
import { Guardian, Clinic, ChipVerification, GlobalStats } from "../generated/schema";

export function handleChipVerified(event: ChipVerified): void {
  let verification = new ChipVerification(
    event.params.chipId.toHex() + "-" + event.params.clinic.toHex()
  );

  verification.chipId = event.params.chipId;
  verification.timestamp = event.params.timestamp;

  // Get or create clinic
  let clinic = Clinic.load(event.params.clinic.toHex());
  if (clinic == null) {
    clinic = new Clinic(event.params.clinic.toHex());
    clinic.address = event.params.clinic;
    clinic.registeredAt = event.block.timestamp;
    clinic.save();
  }

  verification.clinic = clinic.id;
  verification.save();

  updateGlobalStats();
}

export function handleGuardianNFTMinted(event: GuardianNFTMinted): void {
  let guardian = new Guardian(event.params.guardian.toHex());
  guardian.wallet = event.params.guardian;
  guardian.chipId = event.params.chipId;
  guardian.timestamp = event.block.timestamp;
  guardian.tokenId = event.params.tokenId;
  guardian.save();

  // Link to chip verification
  let verification = ChipVerification.load(
    event.params.chipId.toHex() + "-" + event.transaction.from.toHex()
  );
  if (verification != null) {
    verification.guardian = guardian.id;
    verification.save();
  }

  updateGlobalStats();
}

export function handleClinicRegistered(event: ClinicRegistered): void {
  let clinic = new Clinic(event.params.clinic.toHex());
  clinic.address = event.params.clinic;
  clinic.registeredAt = event.block.timestamp;
  clinic.save();
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

  // This is a simplified update - in production you'd want more efficient counting
  stats.lastUpdated = BigInt.fromI32(0); // Would use block timestamp
  stats.save();
}