import { User } from '../types';

const STORAGE_KEY_USERS = 'veritas_users';
const STORAGE_KEY_SESSION = 'veritas_session';

// Helper to get today's date string YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split('T')[0];

export const authService = {
  // Simulate Sign Up
  register: async (email: string, password: string, name: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Network delay

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      plan: 'free',
      dailyUsage: 0,
      lastUsageDate: getTodayString()
    };

    // Store 'password' securely (In a real app, hash this. Here we just mock it)
    const userRecord = { ...newUser, password }; 
    users.push(userRecord);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    
    // Auto login
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newUser));
    return newUser;
  },

  // Simulate Login
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Network delay

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const userRecord = users.find((u: any) => u.email === email && u.password === password);

    if (!userRecord) {
      throw new Error('Invalid credentials');
    }

    // Don't return the password
    const { password: _, ...user } = userRecord;
    
    // Reset usage if new day
    if (user.lastUsageDate !== getTodayString()) {
      user.dailyUsage = 0;
      user.lastUsageDate = getTodayString();
      // Update DB
      const index = users.findIndex((u: any) => u.id === user.id);
      users[index] = { ...users[index], ...user };
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }

    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  getCurrentUser: (): User | null => {
    const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!sessionStr) return null;
    
    const user = JSON.parse(sessionStr);
    
    // Check if we need to reset daily limits based on local time
    if (user.lastUsageDate !== getTodayString()) {
      user.dailyUsage = 0;
      user.lastUsageDate = getTodayString();
      authService.updateUser(user);
    }
    
    return user;
  },

  checkLimit: (user: User): boolean => {
    if (user.plan === 'pro') return true;
    return user.dailyUsage < 3;
  },

  incrementUsage: (userId: string) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const index = users.findIndex((u: any) => u.id === userId);
    
    if (index !== -1) {
      const user = users[index];
      
      // If day changed reset, else increment
      if (user.lastUsageDate !== getTodayString()) {
        user.dailyUsage = 1;
        user.lastUsageDate = getTodayString();
      } else {
        user.dailyUsage += 1;
      }
      
      users[index] = user;
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      
      // Update session if it's the current user
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const { password, ...safeUser } = user;
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(safeUser));
      }
    }
  },

  upgradeToPro: async (userId: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate Stripe processing
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const index = users.findIndex((u: any) => u.id === userId);
    
    if (index === -1) throw new Error("User not found");
    
    users[index].plan = 'pro';
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    
    const { password, ...safeUser } = users[index];
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(safeUser));
    
    return safeUser;
  },
  
  updateUser: (user: User) => {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  }
};
