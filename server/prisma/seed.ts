import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      password: 'password123',
      level: 24,
      xp: 850,
      gold: 5000,
      gems: 500,
      fire: 7,
      healthConnected: false,
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
      gold: 200,
      gems: 200,
      fire: 30,
    },
  });

  // Add a shop item
  await prisma.shopItem.create({
    data: {
      name: "Astral Vault",
      description: "Rare Tier Loot Box",
      type: "lootbox",
      rarity: "rare",
      priceGems: 150
    }
  });

  await prisma.shopItem.create({
    data: {
      name: "Seeker's Crate",
      description: "Common Tier Loot Box",
      type: "lootbox",
      rarity: "common",
      priceGold: 2500
    }
  });

  // Create an active duel between them
  await prisma.duel.create({
    data: {
      challengerId: user.id,
      opponentId: opponent.id,
      status: 'active',
      type: 'step_challenge',
      currentTurnId: user.id
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
