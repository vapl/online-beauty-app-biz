import React, { createContext, useState, useEffect, ReactNode } from "react";
import { auth, firestore } from "../api/firebaseConfig";
import { onAuthStateChanged, User as AuthUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getUserData, updateUser } from "../services/user/userService";
import { handleError } from "../utils/errorHandler";
import { User } from "../types/firestore-types/userTypes";

interface UserContextProps {
  user: AuthUser | null;
  userProfile: User | null;
  isFirstLogin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  setisFirstLogin: (value: boolean) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isFirstLogin, setisFirstLogin] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmailVerified, setIfEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
        setIsLoading(true);

        try {
          // Fetch user data from Firestore
          const userData = await getUserData(currentUser.uid);
          if (userData) {
            setUserProfile({
              ...userData,
              name: userData.name ?? "Unknown user",
              surname: userData.surname ?? "Unknown user",
              email: userData.email ?? "Unknown User",
            });
            setisFirstLogin(userData.isFirstLogin ?? false);
            setIfEmailVerified(currentUser.emailVerified || false);

            if (currentUser.emailVerified && !userData.verified) {
              await updateUser(currentUser.uid, { verified: true });
            }
          } else {
            console.error("No user profile data found.");
            setisFirstLogin(false);
            setUserProfile(null);
          }
        } catch (error) {
          handleError(error, "Fetching user data:");
          setisFirstLogin(true);
          setUserProfile(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIfEmailVerified(false);
        setUserProfile(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userProfile,
        isFirstLogin,
        isAuthenticated,
        isLoading,
        isEmailVerified,
        setisFirstLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
