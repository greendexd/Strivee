import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Find quick duel opponent
router.post('/find', async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Look for active players except current user
    const potentialOpponents = await prisma.user.findMany({
      where: {
        id: { not: userId },
        lastLogin: { gte: tenMinutesAgo }
      },
      take: 5
    });

    let opponent;

    if (potentialOpponents.length > 0) {
      // Pick random opponent from active users
      opponent = potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];
    } else {
      // Fallback: pick any user if no one is recently active
      const anyUser = await prisma.user.findFirst({
         where: { id: { not: userId } }
      });
      opponent = anyUser;
    }

    if (!opponent) {
      return res.status(404).json({ error: 'No opponents available' });
    }

    // Create active duel
    const duel = await prisma.duel.create({
      data: {
        challengerId: userId,
        opponentId: opponent.id,
        status: 'active',
        type: 'quick_duel',
        currentTurnId: userId, // Challenger goes first
        challengerHp: 100,
        opponentHp: 100
      },
      include: {
        challenger: true,
        opponent: true
      }
    });

    res.status(201).json(duel);
  } catch (error) {
    next(error);
  }
});

// Perform battle action
router.post('/:id/action', async (req, res, next) => {
  try {
    const duelId = req.params.id;
    const { userId, actionType } = req.body; // e.g., 'attack', 'defend'

    const duelRecord = await prisma.duel.findUnique({
      where: { id: duelId },
      include: { challenger: true, opponent: true }
    });

    if (!duelRecord) {
      return res.status(404).json({ error: 'Duel not found' });
    }

    if (duelRecord.status !== 'active') {
      return res.status(400).json({ error: 'Duel is not active' });
    }

    if (duelRecord.currentTurnId !== userId) {
      return res.status(403).json({ error: 'Not your turn' });
    }

    const isChallenger = duelRecord.challengerId === userId;
    const opponentId = isChallenger ? duelRecord.opponentId : duelRecord.challengerId;

    let dmg = 0;

    // Simulate simple battle logic
    if (actionType === 'attack') {
       // Random damage between 15 and 30
       dmg = Math.floor(Math.random() * 16) + 15;
    } else if (actionType === 'defend') {
       // Defend heals 10-20
       const heal = Math.floor(Math.random() * 11) + 10;
       dmg = -heal;
    }

    let newChallengerHp = duelRecord.challengerHp;
    let newOpponentHp = duelRecord.opponentHp;

    if (isChallenger) {
       if (dmg > 0) newOpponentHp = Math.max(0, newOpponentHp - dmg);
       else newChallengerHp = Math.min(100, newChallengerHp - dmg);
    } else {
       if (dmg > 0) newChallengerHp = Math.max(0, newChallengerHp - dmg);
       else newOpponentHp = Math.min(100, newOpponentHp - dmg);
    }

    let nextTurnId: string | null = opponentId;
    let status = 'active';
    let winnerId: string | null = null;

    if (newChallengerHp <= 0) {
       status = 'finished';
       winnerId = duelRecord.opponentId;
       nextTurnId = null;
    } else if (newOpponentHp <= 0) {
       status = 'finished';
       winnerId = duelRecord.challengerId;
       nextTurnId = null;
    }

    const updatedDuel = await prisma.duel.update({
      where: { id: duelId },
      data: {
         challengerHp: newChallengerHp,
         opponentHp: newOpponentHp,
         currentTurnId: nextTurnId,
         status: status,
         winnerId: winnerId
      },
      include: { challenger: true, opponent: true }
    });

    res.status(200).json({ duel: updatedDuel, damage: dmg });
  } catch(error) {
    next(error);
  }
});

// Finalize rewards after win
router.post('/:id/sync', async (req, res, next) => {
   try {
     const duelId = req.params.id;
     const duel = await prisma.duel.findUnique({
       where: { id: duelId }
     });

     if (!duel || duel.status !== 'finished') {
       return res.status(400).json({ error: 'Duel not finished or not found' });
     }

     if (!duel.winnerId) {
        return res.status(400).json({ error: 'No winner recorded' });
     }

     // Give the winner some XP/Gold
     const winner = await prisma.user.update({
        where: { id: duel.winnerId },
        data: {
          xp: { increment: 50 },
          gold: { increment: 100 }
        }
     });

     res.status(200).json({ message: 'Rewards synced', winner });
   } catch(error) {
     next(error);
   }
});

// Get user duels
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const duels = await prisma.duel.findMany({
      where: {
        OR: [{ challengerId: userId }, { opponentId: userId }],
        status: { in: ['pending', 'active'] } // Show active matches
      },
      include: { challenger: true, opponent: true },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(duels);
  } catch (error) {
    next(error);
  }
});

export default router;
