import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { UserService, CURRENT_USER_ID } from '../services/api';
import { MOCK_TG_ID, MOCK_TG_NAME } from '../constants';
import type { User } from '../services/api';

// For MVP telegram mock



interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUserLocally: (user: User) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string, type: 'success' | 'error' | 'info', visible: boolean } | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'|'info', visible: boolean} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null);
    }, 3000);
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      // Mock Telegram Login flow first
      await UserService.telegramAuth({ telegramId: MOCK_TG_ID, username: MOCK_TG_NAME });

      // We will still fetch the CURRENT_USER_ID (from seed.ts) so the predefined stats match
      // In a real app we'd use tgUser.id
      const data = await UserService.getUser(CURRENT_USER_ID);

      setUser(data);
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUserLocally = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser: fetchUser, updateUserLocally, showToast, toast }}>
      {children}

      {/* Global Toast Component */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl transition-all duration-300 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} ${toast.type === 'success' ? 'bg-secondary text-background' : toast.type === 'error' ? 'bg-error text-white' : 'bg-surface-container-highest text-white border border-outline-variant/30'}`}>
           <span className="font-bold text-sm flex items-center gap-2">
             {toast.type === 'success' && <span className="material-symbols-outlined text-sm">check_circle</span>}
             {toast.type === 'error' && <span className="material-symbols-outlined text-sm">error</span>}
             {toast.message}
           </span>
        </div>
      )}
    </UserContext.Provider>
  );
}

export const useUser = function() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
