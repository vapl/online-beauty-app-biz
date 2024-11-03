import React from "react";
import Toast from "react-native-root-toast";
import { StyleSheet, Text, View } from "react-native";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  position?: "top" | "center" | "bottom";
}
// Funkcija toast paziņojuma parādīšanai
export const showToast = ({
  message,
  type = "success",
  position = "top",
}: ToastProps) => {
  let backgroundColor = styles.infoToast.backgroundColor;

  if (type === "success") backgroundColor = styles.successToast.backgroundColor;
  if (type === "error") backgroundColor = styles.errorToast.backgroundColor;
  if (type === "warning") backgroundColor = styles.warningToast.backgroundColor;

  let toastPosition: number;

  if (position === "top") {
    toastPosition = Toast.positions.TOP;
  } else if (position === "center") {
    toastPosition = Toast.positions.CENTER;
  } else {
    toastPosition = Toast.positions.BOTTOM;
  }

  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: toastPosition,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: backgroundColor,
    textColor: "#50555C",
    containerStyle: styles.toastContainer,
    textStyle: styles.toastText,
    opacity: 0.9,
  });
};

// Pielāgotu toast stilu definīcija
const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "center",
    elevation: 5, // Android
    shadowColor: "#000", // iOS shadow color
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
    shadowOpacity: 0.3, // iOS shadow opacity (0 to 1)
    shadowRadius: 4, // iOS shadow radius
  },
  toastText: {
    fontSize: 16,
    textAlign: "center",
  },
  successToast: {
    backgroundColor: "#90EE90",
  },
  errorToast: {
    backgroundColor: "#F44336",
  },
  infoToast: {
    backgroundColor: "#2196F3",
  },
  warningToast: {
    backgroundColor: "#FFEB3B",
  },
});

export default showToast;
