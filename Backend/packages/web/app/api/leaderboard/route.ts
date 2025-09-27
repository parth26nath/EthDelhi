import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { LeaderboardEntry } from '@/lib/types';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // In a real implementation, this would query The Graph subgraph
    // For now, we'll use the local database with some mock data

    // Get all guardians
    const guardians = await prisma.guardian.findMany();

    // Calculate leaderboard entries
    const leaderboardEntries: LeaderboardEntry[] = await Promise.all(
      guardians.map(async (guardian) => {
        // Get post count
        const postCount = await prisma.post.count({
          where: { author: guardian.wallet },
        });

        // Get upvote count (upvotes received)
        const posts = await prisma.post.findMany({
          where: { author: guardian.wallet },
          select: { id: true },
        });

        const upvoteCount = await prisma.postUpvote.count({
          where: {
            postId: { in: posts.map(p => p.id) },
          },
        });

        // Get reward allocations
        const rewards = await prisma.rewardAllocation.findMany({
          where: { recipient: guardian.wallet },
        });

        const totalRewards = rewards.reduce(
          (sum, reward) => sum + BigInt(reward.amount),
          0n
        );

        return {
          wallet: guardian.wallet,
          posts: postCount,
          upvotes: upvoteCount,
          rewards: totalRewards,
        };
      })
    );

    // Add some mock data for demonstration
    const mockEntries: LeaderboardEntry[] = [
      {
        wallet: '0x1111111111111111111111111111111111111111',
        posts: 15,
        upvotes: 42,
        rewards: BigInt('1500000000000000000'), // 1.5 ETH
      },
      {
        wallet: '0x2222222222222222222222222222222222222222',
        posts: 12,
        upvotes: 38,
        rewards: BigInt('1200000000000000000'), // 1.2 ETH
      },
      {
        wallet: '0x3333333333333333333333333333333333333333',
        posts: 8,
        upvotes: 25,
        rewards: BigInt('800000000000000000'), // 0.8 ETH
      },
    ];

    // Combine real and mock data
    const allEntries = [...leaderboardEntries, ...mockEntries];

    // Sort by upvotes (default)
    const sortedEntries = allEntries.sort((a, b) => b.upvotes - a.upvotes);

    return NextResponse.json(sortedEntries);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}