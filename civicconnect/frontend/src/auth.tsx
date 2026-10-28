import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser } from "./types";
import { loadUser, saveUser } from "./api";

interface AuthCtx { user: AuthUser | null; signIn: (u: AuthUser) => void; signOut: () => void }
const Ctx = createContext<AuthCtx>({ user: null, signIn: () => {}, signOut: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser());
  const signIn = (u: AuthUser) => { saveUser(u); setUser(u); };
  const signOut = () => { saveUser(null); setUser(null); };
  return <Ctx.Provider value={{ user, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
