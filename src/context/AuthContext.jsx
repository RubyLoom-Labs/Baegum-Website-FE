import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // mode: "login" | "signup" | "forgot" | null (closed)
  const [mode, setMode] = useState(null);

  const openLogin  = () => setMode("login");
  const openSignup = () => setMode("signup");
  const openForgot = () => setMode("forgot");
  const closeAuth  = () => setMode(null);

  return (
    <AuthContext.Provider value={{ mode, openLogin, openSignup, openForgot, closeAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);