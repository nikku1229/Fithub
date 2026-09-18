import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors, globalStyles } from "@/styles/themes";
import loginStyle from "./styles/styles.login";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import forgotStyle from "./styles/styles.forgot";
import useAuthForgotStore from "./store/useAuth.forgot";
import RegisterStyle from "./styles/styles.register";
import { Link } from "expo-router";

const ForgotPasswordScreen = () => {
  const [input, setInput] = useState({
    email: "",
  });
  const { isLoading } = useAuthForgotStore();

  const handleForgot = () => {};

  return (
    <AuthLayout>
      <LinearGradient
        colors={globalColors.gradientLight.color}
        locations={globalColors.gradientLight.location}
        style={[loginStyle.formContainer, loginStyle.keyboardLayoutContainer]}
      >
        <View style={forgotStyle.forgotextContainer}>
          <Text style={forgotStyle.Heading}>Forgot Password</Text>

          <Text style={forgotStyle.inputfieldText}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>
        </View>

        <View style={[loginStyle.inputFieldContainer]}>
          <Text style={[loginStyle.inputFieldLabel]}>Email</Text>
          <View style={[loginStyle.inputWrapper]}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={globalColors.primaryColor}
              style={[loginStyle.frontIcons]}
            />
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              placeholderTextColor={globalColors.grayDark_50}
              accessible={true}
              accessibilityLabel="Email input field"
              accessibilityHint="Enter your email id"
              accessibilityRole="text"
              returnKeyType="send"
              blurOnSubmit={false}
              value={input.email}
              onChangeText={(text) =>
                setInput((prev) => ({ ...prev, email: text }))
              }
              style={[globalStyles.input_field]}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleForgot}
          style={[globalStyles.primary_btn, RegisterStyle.btnContainer]}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Text style={[loginStyle.btnText]}>Sending OTP</Text>
              <Ionicons
                name="reload-outline"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          ) : (
            <>
              <Text style={[loginStyle.btnText]}>Send OTP</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={forgotStyle.backToLoginLinkContainer}>
          <Link href="/login" style={forgotStyle.backToLoginLink}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={globalColors.primaryColor}
            />
            <Text style={forgotStyle.backToLoginLinkText}>Back to Login</Text>
          </Link>
        </TouchableOpacity>
      </LinearGradient>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;
