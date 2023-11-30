import { createContext, useContext } from 'react';
import { Session } from 'next-auth';

interface AuthContextType {
  session: Session | null;
  // You can add more auth related functions here if needed
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
});

export const useAuth = () => useContext(AuthContext);
