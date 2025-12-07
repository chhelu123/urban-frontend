import { create } from 'zustand';

const useAuthStore = create((set) => {
  // Load from localStorage on init
  const stored = localStorage.getItem('auth-storage');
  const initial = stored ? JSON.parse(stored) : { user: null, token: null, isAuthenticated: false };

  return {
    ...initial,
    
    login: (userData) => {
      const newState = {
        user: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          address: userData.address,
          createdAt: userData.createdAt
        },
        token: userData.token,
        isAuthenticated: true
      };
      localStorage.setItem('auth-storage', JSON.stringify(newState));
      set(newState);
    },
    
    logout: () => {
      const newState = {
        user: null,
        token: null,
        isAuthenticated: false
      };
      localStorage.removeItem('auth-storage');
      set(newState);
    },
    
    updateUser: (userData) => set((state) => {
      const newState = {
        ...state,
        user: { ...state.user, ...userData }
      };
      localStorage.setItem('auth-storage', JSON.stringify(newState));
      return newState;
    })
  };
});

export default useAuthStore;
