import React, { useCallback, useEffect, useState } from "react";
import { Snackbar as Snack } from "react-native-paper";
import styled, { useTheme } from "styled-components/native";
import Icon from "react-native-vector-icons/MaterialIcons";

//////////// Styling start ///////////////

const SnackBarContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
`;

const Snackbar = styled(Snack).attrs<{ bgColor: string }>((props) => ({
  wrapperStyle: {
    top: 40,
    borderRadius: 32,
  },
}))`
  background-color: ${(props) => props.bgColor};
  padding-top: 8px;
  padding-bottom: 8px;
  align-items: center;
  border-radius: 16px;
`;

const Row = styled.View`
  width: 90%;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const StyledIcon = styled(Icon).attrs<{ textColor: string }>(() => ({
  size: 24,
}))`
  color: ${(props) => props.textColor};
  align-self: flex-start;
`;

const TextWrapper = styled.Text.attrs<{ textColor: string }>(() => ({}))`
  color: ${(props) => props.textColor};
`;

//////////// Styling end ///////////////

interface SnackProps {
  status: "error" | "success" | "warning";
  children?: string;
  label?: string;
  visible?: boolean;
  duration?: number;
  onPress?: () => void;
}

interface StatusStylesProps {
  icon: string;
  bgColor: string;
  textColor: string;
}

export const SnackbarMessage: React.FC<SnackProps> = ({
  children,
  status = "success",
  label = "UNDO",
  visible = false,
  duration,
  onPress,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const onDismissSnackbar = () => setIsVisible(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handlePress = useCallback(() => {
    setIsVisible(false);
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  const statusStyles: { [key in SnackProps["status"]]: StatusStylesProps } = {
    error: {
      icon: "error-outline",
      bgColor: theme.colors.status.error,
      textColor: theme.colors.white,
    },
    success: {
      icon: "check-circle-outline",
      bgColor: theme.colors.status.success,
      textColor: theme.colors.primary.dark,
    },
    warning: {
      icon: "warning-amber",
      bgColor: theme.colors.status.warning,
      textColor: theme.colors.grey[80],
    },
  };

  const { icon, bgColor, textColor } = statusStyles[status];

  return (
    isVisible && (
      <SnackBarContainer>
        <Snackbar
          visible={isVisible}
          onDismiss={onDismissSnackbar}
          bgColor={bgColor}
          duration={duration}
          action={{
            label: label,
            onPress: handlePress,
            textColor: textColor,
          }}
        >
          <Row>
            <StyledIcon textColor={textColor} name={icon} />
            <TextWrapper textColor={textColor}>{children}</TextWrapper>
          </Row>
        </Snackbar>
      </SnackBarContainer>
    )
  );
};
