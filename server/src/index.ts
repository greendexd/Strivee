import duelsRouter from './routes/duels.js';
import friendsRouter from './routes/friends.js';
import statsRouter from './routes/stats.js';
import shopRouter from './routes/shop.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routers
import usersRouter from './routes/users.js';

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

app.use('/api/users', usersRouter);
app.use('/api/duels', duelsRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/shop', shopRouter);

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
