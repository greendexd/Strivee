import axios from 'axios';

// Fixed user ID corresponding to the one we will create in seed.ts
export const CURRENT_USER_ID = '11111111-1111-1111-1111-111111111111';

// We run backend locally on port 3001
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface User {
  id: string;
  telegramId?: string;
  username: string;
  email?: string;
  level: number;
  xp: number;
  gold: number;
  gems: number;
  fire: number;
  lastLogin: string;
  dailyRewardClaimedAt?: string;
  healthConnected: boolean;
  habits: Habit[];
  inventory: InventoryItem[];
  sentFriendRequests?: Friendship[];
  receivedFriendRequests?: Friendship[];
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  type: string;
  goal: number;
  streak: number;
  userId: string;
}

export interface Duel {
  id: string;
  challengerId: string;
  opponentId: string;
  status: string;
  type: string;
  challengerHp: number;
  opponentHp: number;
  currentTurnId: string | null;
  winnerId: string | null;
  challenger: User;
  opponent: User;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  priceGold: number;
  priceGems: number;
  imageUrl?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  equipped: boolean;
  shopItemId?: string;
  userId: string;
}

export interface Friendship {
  id: string;
  requesterId: string;
  receiverId: string;
  status: string;
  requester: User;
  receiver: User;
}

export interface SocialEvent {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  user: User;
}

export interface UserStats {
  period: string;
  startDate: string;
  summary: {
     wins: number;
     totalMatches: number;
     totalHabits: number;
     bestStreak: number;
     xp: number;
     level: number;
  };
  chartData: number[];
}

export const UserService = {
  getUser: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
  telegramAuth: async (data: { telegramId: string, username?: string, first_name?: string }) => {
    const response = await api.post<User>('/users/telegram-auth', data);
    return response.data;
  },
  claimDailyReward: async (id: string) => {
    const response = await api.post<User>(`/users/${id}/reward`);
    return response.data;
  },
  syncHealth: async (id: string, platform: string, connect?: boolean) => {
    const response = await api.post<{user: User, message?: string}>(`/users/${id}/health/sync`, { platform, connect });
    return response.data.user;
  }
};

export const HabitService = {
  getUserHabits: async (userId: string) => {
    const response = await api.get<Habit[]>(`/users/${userId}/habits`);
    return response.data;
  },
  createHabit: async (data: Partial<Habit>) => {
    const response = await api.post<Habit>('/habits', data);
    return response.data;
  },
};

export const DuelService = {
  getUserDuels: async (userId: string) => {
    const response = await api.get<Duel[]>(`/duels/user/${userId}`);
    return response.data;
  },
  findDuel: async (userId: string) => {
    const response = await api.post<Duel>('/duels/find', { userId });
    return response.data;
  },
  performAction: async (duelId: string, userId: string, actionType: string) => {
    const response = await api.post<{duel: Duel, damage: number}>(`/duels/${duelId}/action`, { userId, actionType });
    return response.data;
  },
  syncRewards: async (duelId: string) => {
    const response = await api.post<{message: string, winner: User}>(`/duels/${duelId}/sync`);
    return response.data.winner;
  }
};

export const ShopService = {
  getCatalog: async () => {
    const response = await api.get<ShopItem[]>('/shop');
    return response.data;
  },
  buyItem: async (userId: string, shopItemId: string) => {
    const response = await api.post<{user: User, item: InventoryItem, message: string}>('/shop/buy', { userId, shopItemId });
    return response.data;
  }
};

export const FriendService = {
  sendRequest: async (requesterId: string, receiverUsername: string) => {
    const response = await api.post<Friendship>('/friends/request', { requesterId, receiverUsername });
    return response.data;
  },
  acceptRequest: async (requestId: string) => {
    const response = await api.post<Friendship>('/friends/accept', { requestId });
    return response.data;
  },
  declineRequest: async (requestId: string) => {
    const response = await api.post<{message: string}>('/friends/decline', { requestId });
    return response.data;
  },
  getFriends: async (userId: string) => {
    const response = await api.get<Friendship[]>(`/friends/${userId}`);
    return response.data;
  },
  interact: async (senderId: string, receiverId: string, type: string) => {
    const response = await api.post<{message: string}>('/friends/interact', { senderId, receiverId, type });
    return response.data;
  }
};

export const StatsService = {
  getStats: async (userId: string, period: string) => {
    const response = await api.get<UserStats>(`/stats/${userId}?period=${period}`);
    return response.data;
  }
};

export const SocialService = {
  getFeed: async () => {
    const response = await api.get<SocialEvent[]>('/social');
    return response.data;
  },
};

export default api;
