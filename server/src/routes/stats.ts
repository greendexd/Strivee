import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get aggregated stats for a user by period
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { period } = req.query; // 'day', 'week', 'month', 'all'

    // Validate user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { habits: true }
    });

    if (!user) {
       return res.status(404).json({ error: 'User not found' });
    }

    // Determine date filter based on period
    const now = new Date();
    let startDate = new Date(0); // 'all' time fallback

    if (period === 'day') {
      startDate = new Date(now.setHours(0,0,0,0));
    } else if (period === 'week') {
      const today = new Date();
      const firstDayOfWeek = today.getDate() - today.getDay();
      startDate = new Date(today.setDate(firstDayOfWeek));
      startDate.setHours(0,0,0,0);
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Aggregate Completed Duels (Wins)
    const duels = await prisma.duel.findMany({
      where: {
        OR: [{ challengerId: userId }, { opponentId: userId }],
        status: 'finished',
        updatedAt: { gte: startDate }
      }
    });

    const wins = duels.filter(d => d.winnerId === userId).length;
    const totalMatches = duels.length;

    // We can also aggregate habits if we had logs, but for MVP we use current state
    const totalHabits = user.habits.length;
    const bestStreak = user.habits.reduce((max, habit) => Math.max(max, habit.streak), user.fire);

    // Mock chart data generation (we don't have historical logs for habits yet)
    // We will return 7 points representing recent days
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
       // Mock logic: randomly generate activity score (0-100) based on user level
       const baseScore = Math.min(100, user.level * 2 + Math.random() * 20);
       chartData.push(Math.floor(baseScore));
    }

    res.status(200).json({
      period: period || 'all',
      startDate: startDate.toISOString(),
      summary: {
         wins,
         totalMatches,
         totalHabits,
         bestStreak,
         xp: user.xp,
         level: user.level
      },
      chartData // array of 7 integers
    });
  } catch (error) {
    next(error);
  }
});

export default router;
