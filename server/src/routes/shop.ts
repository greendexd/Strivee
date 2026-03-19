import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get catalog
router.get('/', async (req, res, next) => {
  try {
    const items = await prisma.shopItem.findMany();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Buy item
router.post('/buy', async (req, res, next) => {
  try {
    const { userId, shopItemId } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const item = await prisma.shopItem.findUnique({ where: { id: shopItemId } });
    if (!item) return res.status(404).json({ error: 'Item not found in shop' });

    // Check balance
    if (item.priceGold > 0 && user.gold < item.priceGold) {
       return res.status(400).json({ error: 'Not enough Gold' });
    }
    if (item.priceGems > 0 && user.gems < item.priceGems) {
       return res.status(400).json({ error: 'Not enough Gems' });
    }

    // Process Transaction
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
         gold: { decrement: item.priceGold },
         gems: { decrement: item.priceGems }
      }
    });

    // Add to Inventory
    const inventoryItem = await prisma.inventoryItem.create({
      data: {
         userId: user.id,
         shopItemId: item.id,
         name: item.name,
         type: item.type,
         rarity: item.rarity,
         equipped: false
      }
    });

    res.status(200).json({ user: updatedUser, item: inventoryItem, message: 'Purchase successful!' });
  } catch (error) {
    next(error);
  }
});

export default router;
