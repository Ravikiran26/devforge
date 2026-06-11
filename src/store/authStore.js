import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user:        null,
      accessToken: null,  // memory only — not persisted (see partialize below)

      setAuth: (user, accessToken) =>
        set({ user, accessToken }),

      setTokens: (accessToken) =>
        set((s) => ({ ...s, accessToken })),

      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'devforge-auth',
      // Only persist the user profile — never tokens
      partialize: (state) => ({ user: state.user }),
    }
  )
)
