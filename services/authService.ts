import { User } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const getTodayString = () => new Date().toISOString().split('T')[0];

// --- MOCK IMPLEMENTATION (Fallback) ---
const LOCAL_STORAGE_USERS_KEY = 'veritas_users';
const LOCAL_STORAGE_SESSION_KEY = 'veritas_session';

const mockAuthService = {
  register: async (email: string, password: string, name: string): Promise<User> => {
    const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      plan: 'free',
      dailyUsage: 0,
      lastUsageDate: getTodayString()
    };

    // Store User (Insecurely stores password for demo purposes only)
    users.push({ ...newUser, password }); 
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    
    // Set Session
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) throw new Error("Invalid email or password");

    // Check Usage Reset
    if (user.lastUsageDate !== getTodayString()) {
      user.dailyUsage = 0;
      user.lastUsageDate = getTodayString();
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    }

    // Set Session (remove password)
    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
    
    return sessionUser;
  },

  logout: async () => {
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const sessionRaw = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (!sessionRaw) return null;
    
    const user = JSON.parse(sessionRaw);
    
    // Sync with "Database" (users array) to get latest usage/plan
    const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const dbUser = users.find((u: any) => u.id === user.id);
    
    if (dbUser) {
      if (dbUser.lastUsageDate !== getTodayString()) {
        dbUser.dailyUsage = 0;
        dbUser.lastUsageDate = getTodayString();
        localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
      }
      return { ...dbUser }; // Return fresh copy
    }
    
    return user;
  },

  checkLimit: (user: User): boolean => {
    if (user.plan === 'pro') return true;
    return user.dailyUsage < 3;
  },

  incrementUsage: async (userId: string) => {
    const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex !== -1) {
      const user = users[userIndex];
      const today = getTodayString();
      
      if (user.lastUsageDate !== today) {
        user.dailyUsage = 1;
        user.lastUsageDate = today;
      } else {
        user.dailyUsage += 1;
      }
      
      users[userIndex] = user;
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
      
      // Update session if it matches
      const sessionRaw = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (sessionRaw) {
        const sessionUser = JSON.parse(sessionRaw);
        if (sessionUser.id === userId) {
           localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user));
        }
      }
    }
  },

  upgradeToPro: async (userId: string): Promise<User> => {
    const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) throw new Error("User not found");
    
    users[userIndex].plan = 'pro';
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    
    // Update session
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(users[userIndex]));
    
    return users[userIndex];
  }
};

// --- REAL IMPLEMENTATION (Supabase) ---

const realAuthService = {
  register: async (email: string, password: string, name: string): Promise<User> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name } // Passed to meta_data, used by trigger to populate profiles
      }
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Registration failed");

    // 2. Fetch the created profile (created via DB trigger)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
        // Fallback: Return basic user if profile fetch lags
        return {
            id: authData.user.id,
            email: email,
            name: name,
            plan: 'free',
            dailyUsage: 0,
            lastUsageDate: getTodayString()
        };
    }

    return mapProfileToUser(profileData);
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Login failed");

    const user = await realAuthService.getCurrentUser();
    if (!user) {
        // Should not happen with robust getCurrentUser, but as a failsafe:
         throw new Error("Failed to load user profile. Please try again.");
    }
    return user;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Safely check for session
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !data?.session?.user) {
        return null;
      }

      const sessionUser = data.session.user;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      // If profile is missing (e.g. legacy user or trigger failed), handle gracefully
      if (error || !profile) {
        console.warn("Profile missing or error fetching, using fallback/recovery:", error);
        
        // Attempt to recover by constructing a default user object from Auth data
        // We do NOT attempt to insert into DB here to avoid complex race conditions or RLS errors on read-path.
        // If the user performs an action (like usage increment), we might handle missing rows there.
        return {
            id: sessionUser.id,
            email: sessionUser.email || '',
            name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'User',
            plan: 'free',
            dailyUsage: 0,
            lastUsageDate: getTodayString()
        };
      }

      // Check if day changed locally vs db
      const today = getTodayString();
      if (profile.last_usage_date !== today) {
        await realAuthService.resetDailyUsage(data.session.user.id);
        profile.daily_usage = 0;
        profile.last_usage_date = today;
      }

      return mapProfileToUser(profile);
    } catch (e) {
      console.warn("Error fetching current user:", e);
      return null;
    }
  },

  checkLimit: (user: User): boolean => {
    if (user.plan === 'pro') return true;
    return user.dailyUsage < 3;
  },

  incrementUsage: async (userId: string) => {
    const today = getTodayString();
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('daily_usage, last_usage_date')
      .eq('id', userId)
      .single();
      
    if (error || !profile) {
        // If profile doesn't exist during increment, try to upsert/insert
        await supabase.from('profiles').upsert({
            id: userId,
            daily_usage: 1,
            last_usage_date: today,
            plan: 'free'
        });
        return;
    }

    let newUsage = profile.daily_usage + 1;
    let newDate = profile.last_usage_date;

    if (profile.last_usage_date !== today) {
        newUsage = 1;
        newDate = today;
    }

    await supabase
      .from('profiles')
      .update({ 
        daily_usage: newUsage,
        last_usage_date: newDate
      })
      .eq('id', userId);
  },

  resetDailyUsage: async (userId: string) => {
    const today = getTodayString();
    await supabase
      .from('profiles')
      .update({ daily_usage: 0, last_usage_date: today })
      .eq('id', userId);
  },

  upgradeToPro: async (userId: string): Promise<User> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ plan: 'pro' })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapProfileToUser(profile);
  }
};

const mapProfileToUser = (profile: any): User => ({
  id: profile.id,
  email: profile.email,
  name: profile.name,
  plan: profile.plan as 'free' | 'pro',
  dailyUsage: profile.daily_usage,
  lastUsageDate: profile.last_usage_date
});

// Export the appropriate service based on configuration
export const authService = isSupabaseConfigured ? realAuthService : mockAuthService;