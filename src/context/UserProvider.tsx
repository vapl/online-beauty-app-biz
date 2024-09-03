import React, { createContext, useState, useEffect, ReactNode } from "react";
import { auth, firestore } from "../api/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { updateUser } from "../services/userService";

interface UserContextProps {
  user: User | null;
  firstLogin: boolean | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firstLogin, setFirstLogin] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmailVerified, setIfEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);

        try {
          setIfEmailVerified(currentUser.emailVerified || false);

          // Fetch user data from Firestore
          const userDocref = doc(firestore, "users", currentUser.uid);
          const userDoc = await getDoc(userDocref);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirstLogin(userData.firstLogin ?? true);

            if (currentUser.emailVerified && !userData.verified) {
              await updateUser(currentUser.uid, { verified: true });
            }
          } else {
            setFirstLogin(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setFirstLogin(true);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setFirstLogin(null);
        setIfEmailVerified(false);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const intervalId = setInterval(async () => {
        await user.reload();
        if (user.emailVerified !== isEmailVerified) {
          setIfEmailVerified(user.emailVerified);
        }
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user, isEmailVerified]);

  return (
    <UserContext.Provider
      value={{ user, firstLogin, isAuthenticated, isLoading, isEmailVerified }}
    >
      {children}
    </UserContext.Provider>
  );
};
