import React from "react";
import { View, Text, Image, ImageBackground, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import authLayoutStyle from "./styles.authLayout";
import { globalStyles } from "@/styles/themes";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={require("../../../assets/images/banner.jpg")}
        style={[globalStyles.globalFlex, authLayoutStyle.authLayoutContainer]}
        resizeMode="cover"
      >
        <SafeAreaView
          style={[globalStyles.globalFlex, authLayoutStyle.authLayoutContainer]}
        >
          <View style={[authLayoutStyle.authLayoutTopHeader]}>
            <View style={authLayoutStyle.authLayoutTopHeaderLogoContainer}>
              <Image
                source={require("../../../assets/logo/Logo.png")}
                style={authLayoutStyle.authLayoutTopHeaderLogo}
              />
            </View>
            <Text style={[authLayoutStyle.authLayoutTopHeaderHeading]}>
              Join The
            </Text>
            <Text style={[authLayoutStyle.authLayoutTopHeaderHeading]}>
              Pulse Community
            </Text>
            <Text style={[authLayoutStyle.authLayoutTopHeaderText]}>
              Set your high performance journey today
            </Text>
          </View>
          <View style={[authLayoutStyle.authFormSection]}>{children}</View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};
