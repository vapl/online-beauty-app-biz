import React, { useEffect, useState } from "react";
import { Modal, Animated, Dimensions, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { BlurView } from "expo-blur";
import Button from "../button/button.component";
import Text from "../text.component";

const { height: screenHeight } = Dimensions.get("window");

const ModalGrabber = styled(View)`
  height: 5px;
  width: 80px;
  border-radius: 3px;
  align-self: center;
  background-color: ${(props) => props.theme.colors.grey[60]};
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: ${(props) => props.theme.space.md}px;
  margin-bottom: ${(props) => props.theme.space.md}px;
`;

const ModalTitleWrapper = styled(View)`
  width: 70%;
  align-items: center;
  justify-items: center;
`;

const ModalTitle = styled(Text)``;

const ButtonWrapper = styled(View)``;
const ButtonLeft = styled(Button)``;
const ButtonRight = styled(Button)``;

const ModalContainer = styled(BlurView)`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const ModalContent = styled(Animated.View)`
  background-color: ${(props) => props.theme.colors.background};
  padding-top: ${(props) => props.theme.space.sm}px;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
  border-top-left-radius: ${(props) => props.theme.sizes.xxl}px;
  border-top-right-radius: ${(props) => props.theme.sizes.xxl}px;
  width: 100%;
  /* iOS */
  box-shadow: 0px -5px 7px rgba(0, 0, 0, 0.1);
  /* Android */
  elevation: 10;
`;

const ModalBody = styled.View`
  flex: 1;
`;

const ModalFooter = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`;

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  onPress: () => void;
  title?: string;
  rightButtonLabel?: string;
  children: React.ReactNode;
  showFooter?: boolean;
  footerButtons?: React.ReactNode;
  isStatic?: boolean;
  initialModalHeight?: number;
  headerLeftButtonVisible?: boolean;
  headerRightButtonVisible?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  onPress,
  title,
  rightButtonLabel,
  children,
  showFooter = true,
  footerButtons,
  isStatic = true,
  initialModalHeight = 0.95,
  headerLeftButtonVisible = true,
  headerRightButtonVisible = true,
}) => {
  const [modalHeight] = useState(
    new Animated.Value(initialModalHeight * screenHeight)
  ); // Initial height
  const translationY = new Animated.Value(0); // Separate animated value for gesture tracking

  useEffect(() => {
    if (visible) {
      // Set the height of the modal when it's opened
      Animated.timing(modalHeight, {
        toValue: initialModalHeight * screenHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, initialModalHeight]);

  const handleGesture = Animated.event([{ nativeEvent: { translationY } }], {
    useNativeDriver: false,
  });

  const handleEndGesture = (event: any) => {
    const { translationY: dragY } = event.nativeEvent;
    const swipeThreshold = 50; // Minimal distance for swipe detection
    const isSwipeUp = dragY < -swipeThreshold;
    const isSwipeDown = dragY > swipeThreshold;

    let targetHeight = initialModalHeight * screenHeight;

    // Block swipe up if `isStatic` is true, but allow swipe down
    if (isSwipeUp && !isStatic) {
      targetHeight = 0.95 * screenHeight; // Swipe up to 95%
    } else if (isSwipeDown) {
      const currentHeight = (modalHeight as any)._value;
      if (currentHeight === 0.95 * screenHeight && !isStatic) {
        targetHeight = initialModalHeight * screenHeight;
      } else {
        targetHeight = 0; // Close modal
      }
    }

    // Animate to target height
    Animated.timing(modalHeight, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (targetHeight === 0) {
        onClose(); // Close the modal if target height is 0
      }
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <PanGestureHandler
        onGestureEvent={!isStatic ? handleGesture : undefined}
        onHandlerStateChange={(event) => {
          // Allow swipe down even if isStatic is true
          if (
            event.nativeEvent.state === State.END &&
            isStatic &&
            event.nativeEvent.translationY > 0
          ) {
            handleEndGesture(event);
          }
          if (!isStatic && event.nativeEvent.state === State.END) {
            handleEndGesture(event);
          }
        }}
      >
        <ModalContainer tint="dark" intensity={10}>
          <ModalContent
            style={{
              height: modalHeight,
            }}
          >
            <ModalGrabber />
            {title && (
              <ModalHeader>
                {headerLeftButtonVisible && (
                  <ButtonWrapper>
                    <ButtonLeft
                      icon="close"
                      label=" "
                      mode={"text"}
                      onPress={onClose}
                    />
                  </ButtonWrapper>
                )}
                <ModalTitleWrapper>
                  <ModalTitle fontVariant="buttonMedium" textAlign="center">
                    {title}
                  </ModalTitle>
                </ModalTitleWrapper>
                {headerRightButtonVisible && (
                  <ButtonWrapper>
                    <ButtonRight
                      label={rightButtonLabel}
                      mode={"text"}
                      onPress={onPress}
                    />
                  </ButtonWrapper>
                )}
              </ModalHeader>
            )}
            <ModalBody>{children}</ModalBody>
            {showFooter && <ModalFooter>{footerButtons}</ModalFooter>}
          </ModalContent>
        </ModalContainer>
      </PanGestureHandler>
    </Modal>
  );
};

export default CustomModal;
