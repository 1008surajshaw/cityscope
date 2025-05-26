import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDb() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database successfully');
    
    // Try to query something simple
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    // List all collections
    const collections = await prisma.$runCommandRaw({
      listCollections: 1
    });
    console.log('Collections in database:', collections);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();