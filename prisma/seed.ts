
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection established successfully');
    
    // Clean up existing data (optional)
    console.log('Cleaning existing data...');
    await prisma.like.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.postTopic.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.topic.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Existing data cleaned');

    console.log('🌱 Seeding database...');

    // Create users
    console.log('Creating users...');
    const user1 = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        isVerified: true,
        onBoard: true,
        country: 'United States',
        city: 'New York',
        location: 'Manhattan'
      }
    });
    console.log('Created user1:', user1.id);

    const user2 = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
        isVerified: true,
        onBoard: true,
        country: 'Canada',
        city: 'Toronto',
        location: 'Downtown'
      }
    });
    console.log('Created user2:', user2.id);

    // Create topics
    console.log('Creating topics...');
    const topic1 = await prisma.topic.create({
      data: {
        name: 'Technology'
      }
    });
    console.log('Created topic1:', topic1.id);

    const topic2 = await prisma.topic.create({
      data: {
        name: 'Travel'
      }
    });
    console.log('Created topic2:', topic2.id);

    const topic3 = await prisma.topic.create({
      data: {
        name: 'Food'
      }
    });
    console.log('Created topic3:', topic3.id);

    // Create posts
    console.log('Creating posts...');
    const post1 = await prisma.post.create({
      data: {
        title: 'Getting Started with Next.js',
        content: 'Next.js is a React framework that enables server-side rendering and static site generation.',
        image: 'https://example.com/images/nextjs.jpg',
        authorId: user1.id,
        totalViews: 120,
        topics: {
          create: {
            topicId: topic1.id
          }
        }
      }
    });
    console.log('Created post1:', post1.id);

    const post2 = await prisma.post.create({
      data: {
        title: 'Exploring Toronto',
        content: 'Toronto is the capital city of the Canadian province of Ontario.',
        image: 'https://example.com/images/toronto.jpg',
        authorId: user2.id,
        totalViews: 85,
        topics: {
          create: [
            { topicId: topic2.id }
          ]
        }
      }
    });
    console.log('Created post2:', post2.id);

    // Create comments
    const comment1 = await prisma.comment.create({
      data: {
        content: 'Great post! Very informative.',
        authorId: user2.id,
        postId: post1.id
      }
    });

    const comment2 = await prisma.comment.create({
      data: {
        content: 'I learned a lot from this.',
        authorId: user1.id,
        postId: post2.id
      }
    });

    // Create nested comment (reply)
    const reply1 = await prisma.comment.create({
      data: {
        content: 'Thanks for your feedback!',
        authorId: user1.id,
        postId: post1.id,
        parentId: comment1.id
      }
    });

    // Create likes
    await prisma.like.create({
      data: {
        authorId: user2.id,
        postId: post1.id
      }
    });

    await prisma.like.create({
      data: {
        authorId: user1.id,
        postId: post2.id
      }
    });

    // Update post counts
    await prisma.post.update({
      where: { id: post1.id },
      data: { 
        totalLikes: 1,
        totalComments: 2 // Including the reply
      }
    });

    await prisma.post.update({
      where: { id: post2.id },
      data: { 
        totalLikes: 1,
        totalComments: 1
      }
    });

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Database connection or seeding failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔄 Database connection closed');
  }
}

main();
