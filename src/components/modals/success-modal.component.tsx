import React from "react";
import { View, Modal, SafeAreaView, StatusBar } from "react-native";
import { Icon } from "react-native-paper";
import styled from "styled-components/native";
import { useTheme } from "styled-components/native";
import Text from "../text.component";
import Button from "../button/button.component";
import Space from "../spacer.component";

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${StatusBar.currentHeight}px;
`;

const ModalWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.status.success};
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

const ContentWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled(View)``;

interface successModalProps {
  visible: boolean;
  onClose?: () => void;
  icon?: string;
  messageTitle: string;
  messageDescription: string;
  buttonLabel?: string;
}

const SuccessModal: React.FC<successModalProps> = ({
  visible,
  onClose,
  icon = "check-circle-outline",
  messageTitle,
  messageDescription,
  buttonLabel = "Continue",
}) => {
  const theme = useTheme();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ModalWrapper>
        <SafeArea>
          <ContentWrapper>
            <Icon source={icon} size={130} color={theme.colors.white} />
            <Text
              fontVariant="h2"
              textColor={theme.colors.white}
              textAlign="center"
            >
              {messageTitle}
            </Text>
            <Space top={theme.space.lg} />
            <Text
              fontVariant="bodyLarge"
              textColor={theme.colors.white}
              textAlign="center"
            >
              {messageDescription}
            </Text>
          </ContentWrapper>
          <ButtonWrapper>
            <Button
              mode={"contained"}
              buttonColor={theme.colors.white}
              labelColor={theme.colors.primary.dark}
              label={buttonLabel}
              onPress={onClose}
            />
          </ButtonWrapper>
        </SafeArea>
      </ModalWrapper>
    </Modal>
  );
};

export default SuccessModal;
