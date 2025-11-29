import { User } from '../types';
import { supabase } from './supabaseClient';

const getTodayString = () => new Date().toISOString().split('T')[0];

export const authService = {
  // Sign Up
  register: async (email: string, password: string, name: string): Promise<User> => {
    // 1. Create Auth User
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
        // Fallback: Return basic user if profile fetch lags (rare)
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

  // Login
  login: async (email: string, password: string): Promise<User> => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Login failed");

    const user = await authService.getCurrentUser();
    if (!user) throw new Error("Failed to load user profile");
    return user;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  // Get Current Session & Profile
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Safely check for session, handling potential network errors from misconfiguration
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !data?.session?.user) {
        return null;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (error || !profile) return null;

      // Check if day changed locally vs db
      const today = getTodayString();
      if (profile.last_usage_date !== today) {
        // Reset logic
        await authService.resetDailyUsage(data.session.user.id);
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
    
    // First, get current count to be safe
    const { data: profile } = await supabase
      .from('profiles')
      .select('daily_usage, last_usage_date')
      .eq('id', userId)
      .single();
      
    if (!profile) return;

    let newUsage = profile.daily_usage + 1;
    let newDate = profile.last_usage_date;

    // Reset if new day detected during increment
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
    // In production, this runs via Stripe Webhook on backend.
    // For this client-side demo:
    
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

// Helper to map DB columns to Typescript Interface
const mapProfileToUser = (profile: any): User => ({
  id: profile.id,
  email: profile.email,
  name: profile.name,
  plan: profile.plan as 'free' | 'pro',
  dailyUsage: profile.daily_usage,
  lastUsageDate: profile.last_usage_date
});