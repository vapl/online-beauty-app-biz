import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VerifyEmailScreenProps } from "../../types/navigationTypes";
import { View, Text } from "react-native";
import * as Linking from "expo-linking";
import { verifyEmailLink } from "../../services/authService";

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = () => {
  const navigation = useNavigation<VerifyEmailScreenProps["navigation"]>();
  const route = useRoute<VerifyEmailScreenProps["route"]>();

  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    const handleVerifyEmail = async () => {
      const { queryParams } = Linking.parse(route.params.url);
      const oobCode = queryParams?.oobCode as string | undefined;

      if (oobCode) {
        const isVerified = await verifyEmailLink(oobCode);
        if (isVerified) {
          setVerified(true);
          setTimeout(() => {
            navigation.navigate("Login");
          }, 3000);
        } else {
          setVerified(false);
          console.error("Verification failed");
        }
      } else {
        console.error("No verification code found in the URL.");
      }
    };

    handleVerifyEmail();
  }, [route.params?.url]);

  return (
    <View>
      {!verified ? (
        <Text>Verifying your email...</Text>
      ) : (
        <Text>Verification successfull! Redirection...</Text>
      )}
    </View>
  );
};

export default VerifyEmailScreen;
