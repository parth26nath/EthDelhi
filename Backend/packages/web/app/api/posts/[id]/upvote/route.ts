import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { voter } = await request.json();
    const postId = params.id;

    if (!voter) {
      return NextResponse.json(
        { error: 'Voter address required' },
        { status: 400 }
      );
    }

    // Check if user already upvoted
    const existingUpvote = await prisma.postUpvote.findUnique({
      where: {
        postId_voter: {
          postId,
          voter,
        },
      },
    });

    if (existingUpvote) {
      return NextResponse.json(
        { error: 'Already upvoted' },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // In a real implementation, you would:
    // 1. Call the smart contract upvote function
    // 2. Wait for transaction confirmation
    // 3. Then record in database

    // Mock blockchain interaction
    const mockTxHash = `0x${Math.random().toString(16).slice(2).padStart(64, '0')}`;
    console.log(`Would call HPVForum.upvote("${postId}") with tx: ${mockTxHash}`);

    // Record the upvote
    const upvote = await prisma.postUpvote.create({
      data: {
        postId,
        voter,
        txHash: mockTxHash,
      },
    });

    // Get updated upvote count
    const upvoteCount = await prisma.postUpvote.count({
      where: { postId },
    });

    return NextResponse.json({
      success: true,
      upvoteCount,
      txHash: mockTxHash,
    });
  } catch (error) {
    console.error('Failed to upvote post:', error);
    return NextResponse.json(
      { error: 'Failed to upvote post' },
      { status: 500 }
    );
  }
}