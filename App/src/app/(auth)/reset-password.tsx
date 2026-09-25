import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRef, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors, globalStyles } from "@/styles/themes";
import loginStyle from "./styles/styles.login";
import forgotStyle from "./styles/styles.forgot";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import useAuthForgotStore from "./store/useAuth.forgot";
import RegisterStyle from "./styles/styles.register";

const ResetPasswordScreen = () => {
  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });
  const confirmPasswordRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useAuthForgotStore((state) => state.isLoading);

  const handleReset = () => {
    if (!input.password || !input.confirmPassword || isLoading) return;

    router.push({
      pathname: "/(auth)/login",
    });
  };

  handleReset;

  return (
    <AuthLayout>
      <LinearGradient
        colors={globalColors.gradientLight.color}
        locations={globalColors.gradientLight.location}
        style={[loginStyle.formContainer, loginStyle.keyboardLayoutContainer]}
      >
        <View style={forgotStyle.forgotextContainer}>
          <Text style={forgotStyle.Heading}>Set New Password</Text>
          <Text style={forgotStyle.inputfieldText}>
            Enter your new password
          </Text>
        </View>

        <View style={[loginStyle.inputFieldContainer]}>
          <Text style={[loginStyle.inputFieldLabel]}>New Password</Text>
          <View style={[loginStyle.inputWrapper]}>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={20}
              color={globalColors.primaryColor}
              style={[loginStyle.frontIcons]}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={globalColors.grayDark_50}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              accessible={true}
              accessibilityLabel="New Password input field"
              accessibilityHint="Enter your new password"
              accessibilityRole="text"
              value={input.password}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              onChangeText={(text) =>
                setInput((prev) => ({ ...prev, password: text }))
              }
              style={[globalStyles.input_field]}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={[loginStyle.backIcons]}
            >
              <Ionicons
                name={!showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={globalColors.primaryColor}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[loginStyle.inputFieldContainer]}>
          <Text style={[loginStyle.inputFieldLabel]}>Confirm Password</Text>
          <View style={[loginStyle.inputWrapper]}>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={20}
              color={globalColors.primaryColor}
              style={[loginStyle.frontIcons]}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={globalColors.grayDark_50}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              accessible={true}
              accessibilityLabel="Confirm Password input field"
              accessibilityHint="Confirm your new password"
              accessibilityRole="text"
              value={input.confirmPassword}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={handleReset}
              onChangeText={(text) =>
                setInput((prev) => ({ ...prev, confirmPassword: text }))
              }
              style={[globalStyles.input_field]}
              ref={confirmPasswordRef}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={[loginStyle.backIcons]}
            >
              <Ionicons
                name={!showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={globalColors.primaryColor}
              />
            </TouchableOpacity>
          </View>
        </View>

          <TouchableOpacity
          onPress={handleReset}
          style={[
            globalStyles.primary_btn,
            RegisterStyle.btnContainer,
            isLoading && globalStyles.loadingBtnOpacity,
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Text style={[RegisterStyle.btnText]}>Verifying</Text>
              <Ionicons
                name="reload-outline"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          ) : (
            <>
              <Text style={[RegisterStyle.btnText]}>Confirm</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          )}
        </TouchableOpacity>

          <TouchableOpacity
          onPress={() => router.back()}
          style={forgotStyle.backToLoginLinkContainer}
        >
          <Link href="/forgot-password" style={forgotStyle.backToLoginLink}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={globalColors.primaryColor}
            />
            <Text style={forgotStyle.backToLoginLinkText}>Back to Forgot</Text>
          </Link>
        </TouchableOpacity>
      </LinearGradient>
    </AuthLayout>
  );
};

export default ResetPasswordScreen;
