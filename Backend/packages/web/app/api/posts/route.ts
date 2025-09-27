import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generatePostId } from '@/lib/utils';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich posts with guardian status and upvote counts
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        // Check if author is a guardian
        const guardian = await prisma.guardian.findUnique({
          where: { wallet: post.author },
        });

        // Get upvote count
        const upvoteCount = await prisma.postUpvote.count({
          where: { postId: post.id },
        });

        return {
          ...post,
          isGuardianPost: !!guardian,
          upvotes: upvoteCount,
        };
      })
    );

    return NextResponse.json(enrichedPosts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, body, author } = await request.json();

    if (!title || !body || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate deterministic post ID
    const postId = generatePostId(title, author);

    // Check if author is a guardian
    const guardian = await prisma.guardian.findUnique({
      where: { wallet: author },
    });

    // In a real implementation, you would:
    // 1. Pin content to IPFS
    // 2. Call the smart contract to emit PostCreated event
    // For now, we'll just store in the database

    const post = await prisma.post.create({
      data: {
        id: postId,
        title,
        body,
        author,
        cid: `mock-ipfs-${Date.now()}`, // Mock IPFS CID
      },
    });

    // Mock blockchain interaction
    console.log(`Would call HPVForum.createPost("${postId}", "${post.cid}")`);

    return NextResponse.json({
      ...post,
      isGuardianPost: !!guardian,
      upvotes: 0,
    });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}