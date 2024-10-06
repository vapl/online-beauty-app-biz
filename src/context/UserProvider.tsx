import React, { createContext, useState, useEffect, ReactNode } from "react";
import { auth, firestore } from "../api/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getUserData, updateUser } from "../services/userService";
import { handleError } from "../utils/errorHandler";

interface UserContextProps {
  user: User | null;
  firstLogin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  setFirstLogin: (value: boolean) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firstLogin, setFirstLogin] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmailVerified, setIfEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);

        try {
          // Fetch user data from Firestore
          const userData = await getUserData();
          if (userData) {
            setFirstLogin(userData.firstLogin ?? false);
            setIfEmailVerified(currentUser.emailVerified || false);

            if (currentUser.emailVerified && !userData.verified) {
              await updateUser(currentUser.uid, { verified: true });
            }
          } else {
            console.error("No user data found.");
            setFirstLogin(false);
          }
        } catch (error) {
          handleError(error, "Fetching user data:");
          setFirstLogin(true);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIfEmailVerified(false);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        firstLogin,
        isAuthenticated,
        isLoading,
        isEmailVerified,
        setFirstLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
