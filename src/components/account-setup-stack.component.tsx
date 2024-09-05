import React, { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import AccountVerificationBanner from "./complete-setup-banner.component";
import AppStack from "../navigation/AppStack";

const AccountSetupStack: React.FC = () => {
  const userContext = useContext(UserContext);
  if (!userContext) return;
  const { isEmailVerified } = userContext;

  return (
    <>
      {!isEmailVerified && <AccountVerificationBanner />}
      <AppStack />
    </>
  );
};

export default AccountSetupStack;
