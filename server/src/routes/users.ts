import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Telegram Auth Flow
router.post('/telegram-auth', async (req, res, next) => {
  try {
    const { telegramId, username, first_name } = req.body;

    if (!telegramId) {
      return res.status(400).json({ error: 'telegramId is required' });
    }

    const displayName = username || first_name || 'Hero';

    let user = await prisma.user.findUnique({
      where: { telegramId },
      include: { habits: true, inventory: true }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId,
          username: `${displayName}_${Math.floor(Math.random() * 10000)}`,
          gold: 500,
          gems: 50,
        },
        include: { habits: true, inventory: true }
      });
    } else {
      user = await prisma.user.update({
        where: { telegramId },
        data: { lastLogin: new Date() },
        include: { habits: true, inventory: true }
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        habits: true,
        inventory: true,
        sentFriendRequests: { include: { receiver: true } },
        receivedFriendRequests: { include: { requester: true } }
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;

// Daily Reward Flow
router.post('/:id/reward', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    // Check if claimed today
    if (user.dailyRewardClaimedAt) {
      const lastClaim = new Date(user.dailyRewardClaimedAt);
      if (
        lastClaim.getDate() === now.getDate() &&
        lastClaim.getMonth() === now.getMonth() &&
        lastClaim.getFullYear() === now.getFullYear()
      ) {
        return res.status(400).json({ error: 'Reward already claimed today' });
      }
    }

    // Grant Reward (e.g. 50 Gold, 20 XP)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        gold: { increment: 50 },
        xp: { increment: 20 },
        dailyRewardClaimedAt: now
      },
      include: { habits: true, inventory: true }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Mock Health/Fit Integration Flow
router.post('/:id/health/sync', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { connect } = req.body; // e.g. platform: 'apple_health' or 'google_fit'

    if (connect !== undefined) {
       // Toggle connection status
       const user = await prisma.user.update({
         where: { id: userId },
         data: { healthConnected: connect },
         include: { habits: true, inventory: true }
       });
       return res.status(200).json(user);
    }

    // Mock sync data: add 500 steps to the 'step' habit if connected
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { habits: true }
    });

    if (!user || !user.healthConnected) {
       return res.status(400).json({ error: 'Health tracking not connected' });
    }

    let stepHabit = user.habits.find(h => h.type === 'step');

    // Create habit if missing just for simulation
    if (!stepHabit) {
       stepHabit = await prisma.habit.create({
         data: {
           title: '10k Step March',
           type: 'step',
           goal: 10000,
           userId: user.id
         }
       });
    }

    // In a real app we'd update a specific daily progress table. Here we mock XP addition for the sync
    const updatedUser = await prisma.user.update({
       where: { id: userId },
       data: { xp: { increment: 15 } },
       include: { habits: true, inventory: true }
    });

    res.status(200).json({ user: updatedUser, message: 'Synced 500 steps' });
  } catch(error) {
    next(error);
  }
});
