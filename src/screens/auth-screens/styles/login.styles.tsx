import { View } from "react-native";
import styled from "styled-components/native";

//////////// Styling start ///////////////

export const ScreenContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
  padding-left: ${(props) => props.theme.space.md}px;
  padding-right: ${(props) => props.theme.space.md}px;
`;

export const Header = styled(View)`
  justify-content: flex-start;
  padding-top: ${(props) => props.theme.space.xxl}px;
  gap: ${(props) => props.theme.space.sm}px;
`;

export const FormWrapper = styled(View)`
  flex: 1;
  justify-content: flex-end;
`;

export const BodyWrapper = styled(View)`
  flex: 1;
  justify-content: center;
`;

export const InputWrapper = styled(View)`
  padding-top: ${(props) => props.theme.space.md}px;
  justify-content: center;
  align-items: stretch;
  gap: ${(props) => props.theme.space.sm}px;
`;

export const DividerWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.theme.space.xl}px;
  margin: 16px 0 16px 0;
`;

export const Divider = styled(View)`
  height: 1px;
  background-color: ${(props) => props.theme.colors.grey[40]};
  flex-grow: 1;
`;

export const FooterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.theme.space.lg}px;
  margin-bottom: ${(props) => props.theme.space.lg}px;
  gap: ${(props) => props.theme.space.sm}px;
`;

////////////  Styling end  ///////////////
