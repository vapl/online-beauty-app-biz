import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { authStateListener } from "../../api/auth";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

const AppNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
