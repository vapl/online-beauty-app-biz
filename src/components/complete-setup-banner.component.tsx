import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import Text from "./text.component";
import styled from "styled-components/native";
import { UserContext } from "../context/UserProvider";

const Notification = styled(View)`
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: ${(props) => props.theme.colors.primary.dark};
  visibility: visible;
`;

const NotificationContent = styled(Text)`
  color: ${(props) => props.theme.colors.white};
`;

const AccountVerificationBanner: React.FC = () => {
  const [content, setContent] = useState<string | null>(null);

  const userContext = useContext(UserContext);
  if (!userContext) return;
  const { user, isEmailVerified } = userContext;

  useEffect(() => {
    if (!isEmailVerified) {
      setContent("Please verify your email to access all features.");
    } else {
      setContent(null);
    }
  }, [isEmailVerified, user]);

  if (!content) return null;
  return (
    <>
      <Notification>
        <NotificationContent>{content}</NotificationContent>
      </Notification>
    </>
  );
};

export default AccountVerificationBanner;
