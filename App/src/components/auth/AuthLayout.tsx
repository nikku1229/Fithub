import React from "react";
import { View, Text } from "react-native";
import authLayoutStyle from "./styles.authLayout";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View>
      <Text>Welcome</Text>
      <Text>Lets start</Text>
      <View>{children}</View>
    </View>
  );
};
