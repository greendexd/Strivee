import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Send Friend Request
router.post('/request', async (req, res, next) => {
  try {
    const { requesterId, receiverUsername } = req.body;

    if (!requesterId || !receiverUsername) {
      return res.status(400).json({ error: 'Missing requesterId or receiverUsername' });
    }

    const receiver = await prisma.user.findUnique({
      where: { username: receiverUsername }
    });

    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (requesterId === receiver.id) {
       return res.status(400).json({ error: 'Cannot add yourself' });
    }

    // Check existing
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, receiverId: receiver.id },
          { requesterId: receiver.id, receiverId: requesterId }
        ]
      }
    });

    if (existing) {
       return res.status(400).json({ error: 'Friendship request already exists' });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        receiverId: receiver.id,
        status: 'pending'
      },
      include: { requester: true, receiver: true }
    });

    res.status(201).json(friendship);
  } catch (error) {
    next(error);
  }
});

// Accept Request
router.post('/accept', async (req, res, next) => {
  try {
    const { requestId } = req.body;

    const friendship = await prisma.friendship.update({
      where: { id: requestId },
      data: { status: 'accepted' },
      include: { requester: true, receiver: true }
    });

    res.status(200).json(friendship);
  } catch (error) {
    next(error);
  }
});

// Decline Request
router.post('/decline', async (req, res, next) => {
  try {
    const { requestId } = req.body;

    const friendship = await prisma.friendship.update({
      where: { id: requestId },
      data: { status: 'declined' }
    });

    res.status(200).json({ message: 'Request declined', friendship });
  } catch (error) {
    next(error);
  }
});

// Get User's Friends
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { receiverId: userId }
        ]
      },
      include: { requester: true, receiver: true }
    });

    res.status(200).json(friendships);
  } catch (error) {
    next(error);
  }
});

// Social Interactions (Nudge, Congrats)
router.post('/interact', async (req, res, next) => {
  try {
    const { senderId, receiverId, type } = req.body; // type: 'nudge' or 'congrats'

    // Real app: we'd push this to a notification service or create a SocialEvent
    const event = await prisma.socialEvent.create({
      data: {
        userId: receiverId,
        type: type,
        message: `${senderId} sent you a ${type}!`
      }
    });

    res.status(201).json({ message: `${type} sent`, event });
  } catch (error) {
    next(error);
  }
});

export default router;
