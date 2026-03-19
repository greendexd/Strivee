import axios from 'axios';

// Fixed user ID corresponding to the one we will create in seed.ts
export const CURRENT_USER_ID = '11111111-1111-1111-1111-111111111111';

const API_BASE_URL = 'https://strivee.199.83.103.191.sslip.io/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  gems: number;
  fire: number;
  habits: Habit[];
  inventory: Item[];
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
  challenger: User;
  opponent: User;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  rarity: string;
  userId: string;
}

export interface SocialEvent {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  user: User;
}

export const UserService = {
  getUser: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
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
    const response = await api.get<Duel[]>(`/users/${userId}/duels`);
    return response.data;
  },
  createDuel: async (data: Partial<Duel>) => {
    const response = await api.post<Duel>('/duels', data);
    return response.data;
  },
};

export const InventoryService = {
  createItem: async (data: Partial<Item>) => {
    const response = await api.post<Item>('/inventory', data);
    return response.data;
  },
};

export const SocialService = {
  getFeed: async () => {
    const response = await api.get<SocialEvent[]>('/social');
    return response.data;
  },
};

export default api;