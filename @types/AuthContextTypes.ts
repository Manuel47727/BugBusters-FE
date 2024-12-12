export interface AuthContextType {
  user: {
    name: string;
    email: string;
    role: string;
    [key: string]: any; // If user has other dynamic properties
  };
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
