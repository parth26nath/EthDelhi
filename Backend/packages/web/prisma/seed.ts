import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create some sample posts
  const samplePosts = [
    {
      id: 'sample-post-1',
      author: '0x1234567890123456789012345678901234567890',
      title: 'HPV Vaccine Side Effects - Your Experiences?',
      body: 'Hi everyone! I got my HPV vaccine last week and wondering what side effects others experienced. I had some arm soreness for a couple days. Is this normal?',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'sample-post-2',
      author: '0x2345678901234567890123456789012345678901',
      title: 'Scheduling Second Dose - Questions',
      body: 'My doctor recommended waiting 6 months between doses. Has anyone had experience with different timing? What worked best for you?',
      createdAt: new Date('2024-01-16'),
    },
    {
      id: 'sample-post-3',
      author: '0x3456789012345678901234567890123456789012',
      title: 'Support for Those Considering Vaccination',
      body: 'For anyone on the fence about getting vaccinated - I was hesitant too but so glad I did. Happy to answer any questions about my experience.',
      createdAt: new Date('2024-01-17'),
    }
  ];

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: post,
    });
  }

  // Create some sample comments
  const sampleComments = [
    {
      postId: 'sample-post-1',
      author: '0x4567890123456789012345678901234567890123',
      body: 'I had similar side effects! Arm soreness is totally normal and usually goes away within a few days.',
      createdAt: new Date('2024-01-15T12:30:00'),
    },
    {
      postId: 'sample-post-1',
      author: '0x5678901234567890123456789012345678901234',
      body: 'Thanks for sharing this question! I was worried about the same thing.',
      createdAt: new Date('2024-01-15T14:15:00'),
    },
    {
      postId: 'sample-post-2',
      author: '0x6789012345678901234567890123456789012345',
      body: 'I waited 6 months between my doses and had no issues. That timing seems to be pretty standard.',
      createdAt: new Date('2024-01-16T10:00:00'),
    }
  ];

  for (const comment of sampleComments) {
    await prisma.comment.create({
      data: comment,
    });
  }

  // Create sample guardians
  const sampleGuardians = [
    {
      wallet: '0x1234567890123456789012345678901234567890',
      chipId: '0xabcdef1234567890abcdef1234567890abcdef12',
      tokenId: '1',
    },
    {
      wallet: '0x2345678901234567890123456789012345678901',
      chipId: '0xbcdef1234567890abcdef1234567890abcdef123',
      tokenId: '2',
    }
  ];

  for (const guardian of sampleGuardians) {
    await prisma.guardian.upsert({
      where: { wallet: guardian.wallet },
      update: {},
      create: guardian,
    });
  }

  // Create sample upvotes
  const sampleUpvotes = [
    {
      postId: 'sample-post-1',
      voter: '0x2345678901234567890123456789012345678901',
      txHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
    },
    {
      postId: 'sample-post-1',
      voter: '0x3456789012345678901234567890123456789012',
      txHash: '0x2222222222222222222222222222222222222222222222222222222222222222',
    },
    {
      postId: 'sample-post-2',
      voter: '0x1234567890123456789012345678901234567890',
      txHash: '0x3333333333333333333333333333333333333333333333333333333333333333',
    }
  ];

  for (const upvote of sampleUpvotes) {
    await prisma.postUpvote.upsert({
      where: {
        postId_voter: {
          postId: upvote.postId,
          voter: upvote.voter,
        },
      },
      update: {},
      create: upvote,
    });
  }

  console.log('✅ Seeding completed!');
  console.log(`Created ${samplePosts.length} posts`);
  console.log(`Created ${sampleComments.length} comments`);
  console.log(`Created ${sampleGuardians.length} guardians`);
  console.log(`Created ${sampleUpvotes.length} upvotes`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });