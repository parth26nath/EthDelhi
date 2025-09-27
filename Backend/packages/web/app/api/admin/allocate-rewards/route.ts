import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { allocations, adminAddress } = await request.json();

    if (!allocations || !Array.isArray(allocations)) {
      return NextResponse.json(
        { error: 'Invalid allocations format' },
        { status: 400 }
      );
    }

    if (!adminAddress) {
      return NextResponse.json(
        { error: 'Admin address required' },
        { status: 400 }
      );
    }

    // Validate allocations
    for (const allocation of allocations) {
      if (!allocation.recipient || !allocation.amount) {
        return NextResponse.json(
          { error: 'Each allocation must have recipient and amount' },
          { status: 400 }
        );
      }

      if (!allocation.recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
        return NextResponse.json(
          { error: `Invalid recipient address: ${allocation.recipient}` },
          { status: 400 }
        );
      }
    }

    // In a real implementation, you would:
    // 1. Verify the admin is the contract owner
    // 2. Call HPVRewards.allocateRewards(recipients[], amounts[])
    // 3. Wait for transaction confirmation
    // 4. Record allocations in database

    // Mock blockchain interaction
    const mockTxHash = `0x${Math.random().toString(16).slice(2).padStart(64, '0')}`;
    console.log(`Would call HPVRewards.allocateRewards() with tx: ${mockTxHash}`);

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Record allocations in database
    const rewardRecords = await Promise.all(
      allocations.map(async (allocation: { recipient: string; amount: string }) => {
        // Convert ETH to wei for storage
        const amountInWei = (parseFloat(allocation.amount) * 1e18).toString();

        return prisma.rewardAllocation.create({
          data: {
            recipient: allocation.recipient,
            amount: amountInWei,
            txHash: mockTxHash,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      txHash: mockTxHash,
      allocations: rewardRecords.length,
      message: `Successfully allocated rewards to ${rewardRecords.length} recipients`,
    });
  } catch (error) {
    console.error('Failed to allocate rewards:', error);
    return NextResponse.json(
      { error: 'Failed to allocate rewards' },
      { status: 500 }
    );
  }
}