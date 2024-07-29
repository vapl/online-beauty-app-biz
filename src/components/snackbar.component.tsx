import React, { useEffect, useState } from "react";
import { Snackbar as Snack } from "react-native-paper";
import styled, { useTheme } from "styled-components/native";

//////////// Styling start ///////////////

const SnackBarContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
`;

const Snackbar = styled(Snack).attrs((props) => ({
  wrapperStyle: {
    top: 40,
    borderRadius: 32,
  },
}))`
  background-color: ${(props) => props.theme.colors.accent.darkPink};
  height: 86px;
  align-items: center;
  border-radius: 16px;
`;

//////////// Styling end ///////////////

interface SnackProps {
  children?: string;
  label?: string;
  visible?: boolean;
  onPress: () => void;
}

export const SnackbarMessage: React.FC<SnackProps> = ({
  children,
  label = "undo",
  visible = false,
  onPress,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const onDismissSnackbar = () => setIsVisible(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  return (
    isVisible && (
      <SnackBarContainer>
        <Snackbar
          visible={isVisible}
          onDismiss={onDismissSnackbar}
          action={{
            label: label,
            onPress: onPress,
          }}
        >
          {children}
        </Snackbar>
      </SnackBarContainer>
    )
  );
};
