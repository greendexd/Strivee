import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'The Quest API is running smoothly' });
});

// --- USERS ---
app.post('/api/users/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // In a real app, hash password using bcrypt here
    const user = await prisma.user.create({
      data: { username, email, password },
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { habits: true, inventory: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// --- HABITS ---
app.post('/api/habits', async (req, res, next) => {
  try {
    const { title, description, type, goal, userId } = req.body;
    const habit = await prisma.habit.create({
      data: { title, description, type, goal, userId },
    });
    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:userId/habits', async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.params.userId },
    });
    res.json(habits);
  } catch (error) {
    next(error);
  }
});

// --- DUELS ---
app.post('/api/duels', async (req, res, next) => {
  try {
    const { challengerId, opponentId, type } = req.body;
    const duel = await prisma.duel.create({
      data: { challengerId, opponentId, type, status: 'pending' },
    });
    res.status(201).json(duel);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:userId/duels', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const duels = await prisma.duel.findMany({
      where: {
        OR: [{ challengerId: userId }, { opponentId: userId }],
      },
      include: { challenger: true, opponent: true }
    });
    res.json(duels);
  } catch (error) {
    next(error);
  }
});

// --- INVENTORY / SHOP ---
app.post('/api/inventory', async (req, res, next) => {
  try {
    const { name, type, rarity, userId } = req.body;
    const item = await prisma.item.create({
      data: { name, type, rarity, userId },
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// --- SOCIAL FEED ---
app.get('/api/social', async (req, res, next) => {
  try {
    const events = await prisma.socialEvent.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
});

// Basic Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
