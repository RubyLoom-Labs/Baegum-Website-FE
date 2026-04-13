import { createContext, useContext, useState, useEffect } from "react";
import { setCookie, getCookie, removeCookie } from "@/utils/cookies";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // mode: "login" | "signup" | "forgot" | null (closed)
  const [mode, setMode] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount (check cookie for token)
  useEffect(() => {
    const token = getCookie("authToken");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
        removeCookie("authToken");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const openLogin  = () => setMode("login");
  const openSignup = () => setMode("signup");
  const openForgot = () => setMode("forgot");
  const closeAuth  = () => setMode(null);

  const login = (userData, token) => {
    // Save token to cookie (expires in 7 days)
    setCookie("authToken", token, 7);
    // Save user data to localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    setIsLoggedIn(true);
    setUser(userData);
    closeAuth();
  };

  const logout = () => {
    // Clear token from cookie
    removeCookie("authToken");
    // Clear user data from localStorage
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      mode,
      isLoggedIn,
      user,
      loading,
      openLogin,
      openSignup,
      openForgot,
      closeAuth,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
