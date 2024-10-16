import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";

// Interface for session data
interface SessionData {
  username: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Interface for the session context functions and state
interface SessionContextProps {
  session: SessionData;
  setSession: (session: SessionData) => void;
  clearSession: () => void;
  isLoggedIn: () => boolean;
}

// Create the session context
const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

// Define the cookie options for session storage
const cookieOptions = {
  expires: 7, // Expires in 7 days
  secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  sameSite: "strict" as const,
};

// Create the provider component
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with values from cookies if available
  const [session, setSessionState] = useState<SessionData>({
    username: Cookies.get("username") || null,
    accessToken: Cookies.get("accessToken") || null,
    refreshToken: Cookies.get("refreshToken") || null,
  });

  // Function to update the session and store in cookies
  const setSession = (newSession: SessionData) => {
    setSessionState(newSession);
    // Store session data in cookies
    Cookies.set("username", newSession.username || "", cookieOptions);
    Cookies.set("accessToken", newSession.accessToken || "", cookieOptions);
    Cookies.set("refreshToken", newSession.refreshToken || "", cookieOptions);
  };

  // Function to clear the session and remove cookies
  const clearSession = () => {
    setSessionState({
      username: null,
      accessToken: null,
      refreshToken: null,
    });
    // Remove cookies
    Cookies.remove("username");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  // Check if the user is logged in based on session data
  const isLoggedIn = (): boolean => {
    return !!(session.accessToken && session.refreshToken);
  };

  return (
    <SessionContext.Provider
      value={{ isLoggedIn, session, setSession, clearSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use the session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
