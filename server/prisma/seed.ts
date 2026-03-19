import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// We must construct Prisma with the database URL explicitly here due to environment variable
// resolution context sometimes failing when seeding directly via TSX from within the node_modules
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://thequest:password@localhost:5432/thequest?schema=public'
    }
  }
});

const FIXED_USER_ID = '11111111-1111-1111-1111-111111111111';

async function main() {
  console.log('Seeding database...');

  // Create main user
  const user = await prisma.user.upsert({
    where: { id: FIXED_USER_ID },
    update: {},
    create: {
      id: FIXED_USER_ID,
      username: 'Alex',
      email: 'alex@example.com',
      password: 'password123', // In a real app, hash this
      level: 24,
      xp: 850,
      gems: 500,
      fire: 7,
      habits: {
        create: [
          {
            title: 'Slayer of the Blue Screen',
            description: 'No phone 30 mins before bed',
            type: 'sleep',
            goal: 1,
            streak: 7,
          },
          {
            title: '10k Step March',
            description: 'Walk 10,000 steps daily',
            type: 'step',
            goal: 10000,
            streak: 12,
          }
        ]
      },
      inventory: {
        create: [
          {
            name: 'Celestial Wings',
            type: 'skin',
            rarity: 'rare',
          },
          {
            name: 'Streak Freeze',
            type: 'utility',
            rarity: 'common',
          }
        ]
      }
    },
  });

  // Create opponent user
  const opponent = await prisma.user.upsert({
    where: { username: 'Sarah' },
    update: {},
    create: {
      username: 'Sarah',
      email: 'sarah@example.com',
      password: 'password123',
      level: 22,
      xp: 400,
      gems: 200,
      fire: 30,
    },
  });

  // Create an active duel between them
  await prisma.duel.create({
    data: {
      challengerId: user.id,
      opponentId: opponent.id,
      status: 'active',
      type: 'step_challenge',
    }
  });

  // Create some social events
  await prisma.socialEvent.create({
    data: {
      userId: opponent.id,
      type: 'streak',
      message: 'Sarah reached a 30 DAY STREAK! Sarah is UNSTOPPABLE!',
    }
  });

  await prisma.socialEvent.create({
    data: {
      userId: user.id,
      type: 'evolution',
      message: 'Alex just evolved their pet to Level 5!',
    }
  });

  console.log('Database seeded successfully.');
  console.log(`Created Main User with ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });