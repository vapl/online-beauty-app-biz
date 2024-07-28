import { StyleSheet } from 'react-native';

// Definējam kopējos stilus fontiem
const fontFamily = {
  manropeBold: 'Manrope-Bold',
  manropeSemiBold: 'Manrope-SemiBold',
  ManropeRegular: 'Manrope-Regular',
};

export const typography = StyleSheet.create({
  h1: {
    fontFamily: fontFamily.manropeBold,
    fontSize: 48,
  },
  h2: {
    fontFamily: fontFamily.manropeBold,
    fontSize: 32,
  },
  h3: {
    fontFamily: fontFamily.manropeBold,
    fontSize: 24,
  },
  h4: {
    fontFamily: fontFamily.manropeBold,
    fontSize: 20,
  },
  h5: {
    fontFamily: fontFamily.manropeBold,
    fontSize: 16,
  },
  h6: {
    fontFamily: fontFamily.manropeBold,
    fontSize: 14,
  },
  bodyLarge: {
    fontFamily: fontFamily.ManropeRegular,
    fontSize: 16,
  },
  bodyMedium: {
    fontFamily: fontFamily.ManropeRegular,
    fontSize: 14,
  },
  bodySmall: {
    fontFamily: fontFamily.ManropeRegular,
    fontSize: 12,
  },
  buttonLarge: {
    fontFamily: fontFamily.manropeSemiBold,
    fontSize: 16,
  },
  buttonMedium: {
    fontFamily: fontFamily.manropeSemiBold,
    fontSize: 14,
  },
  buttonSmall: {
    fontFamily: fontFamily.manropeSemiBold,
    fontSize: 12,
  },
});
