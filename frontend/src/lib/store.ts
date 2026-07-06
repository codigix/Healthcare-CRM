import { create } from 'zustand';

interface User {
 id: string;
 name: string;
 email: string;
 role: string;
 department?: string;
 doctorId?: string;
 avatar?: string;
}

interface AuthStore {
 user: User | null;
 token: string | null;
 isAuthenticated: boolean;
 setUser: (user: User) => void;
 setToken: (token: string) => void;
 setAuth: (user: User, token: string) => void;
 logout: () => void;
}

const resolveUserDepartment = (user: User | null): User | null => {
 if (!user) return null;
 if (!user.department) {
 const email = user.email.toLowerCase();
 const name = user.name.toLowerCase();
 
 if (user.role === 'admin') {
 user.department = 'Admin';
 } else if (user.role === 'doctor') {
 user.department = 'Doctor';
 } else if (email.includes('inventory') || name.includes('inventory')) {
 user.department = 'Inventory';
 } else if (email.includes('lab') || name.includes('lab') || email.includes('laboratory') || name.includes('laboratory')) {
 user.department = 'Laboratory';
 } else if (email.includes('reception') || name.includes('reception')) {
 user.department = 'Receptionist';
 } else {
 user.department = 'Admin';
 }
 }
 return user;
};

export const useAuthStore = create<AuthStore>((set) => ({
 user: null,
 token: null,
 isAuthenticated: false,
 setUser: (user) => set({ user: resolveUserDepartment(user) }),
 setToken: (token) => set({ token }),
 setAuth: (user, token) => set({ user: resolveUserDepartment(user), token, isAuthenticated: true }),
 logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

interface UIStore {
 sidebarOpen: boolean;
 theme: 'light' | 'dark';
 isNavigating: boolean;
 setSidebarOpen: (open: boolean) => void;
 setTheme: (theme: 'light' | 'dark') => void;
 setIsNavigating: (navigating: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
 sidebarOpen: true,
 theme: 'light',
 isNavigating: false,
 setSidebarOpen: (open) => set({ sidebarOpen: open }),
 setTheme: (theme) => set({ theme }),
 setIsNavigating: (navigating) => set({ isNavigating: navigating }),
}));
