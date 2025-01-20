import type { User } from "@config/core";

import type React from "react";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [currentUser, setUser] = useState<User>(user);
  return <AuthContext.Provider value={{ user: currentUser, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
