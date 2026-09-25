import { useState, useRef, useEffect } from "react";
import { Link, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useAuthLogin from "./store/useAuth.login";
import loginStyle from "./styles/styles.login";
import { globalColors, globalStyles } from "@/styles/themes";

const LoginScreen = () => {
  const router = useRouter();

  const { login, isLoading, error } = useAuthLogin();

  const passwordRef = useRef<TextInput>(null);

  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      console.log("Login Page Error:", error);
      //Toast apply
    }
  }, [error]);

  const handleLogin = async () => {
    if (!input.email.trim() || !input.password) return;

    const isLogin = await login(input);
    if (isLogin && useAuthLogin.getState().needsOnboarding) {
      router.replace({
        pathname: "/username",
        params: {
          loginEmail: input.email,
          loginPassword: input.password,
          fromLogin: "true",
        },
      });
      setInput({ email: "", password: "" });
    }
    if (isLogin && !useAuthLogin.getState().needsOnboarding) {
      setInput({ email: "", password: "" });
      console.log("Login successful");
      // router.replace("/(tabs)");
    }
  };

  return (
    <AuthLayout>
      <LinearGradient
        colors={globalColors.gradientLight.color}
        locations={globalColors.gradientLight.location}
        style={[loginStyle.formContainer, loginStyle.keyboardLayoutContainer]}
      >
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
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
              value={input.email}
              onChangeText={(text) =>
                setInput((prev) => ({ ...prev, email: text }))
              }
              style={[globalStyles.input_field]}
            />
          </View>
        </View>

        <View style={[loginStyle.inputFieldContainer]}>
          <Text style={[loginStyle.inputFieldLabel]}>Password</Text>
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
              accessibilityLabel="Password input field"
              accessibilityHint="Enter your password"
              accessibilityRole="text"
              value={input.password}
              returnKeyType="send"
              blurOnSubmit={true}
              onSubmitEditing={handleLogin}
              onChangeText={(text) =>
                setInput((prev) => ({ ...prev, password: text }))
              }
              style={[globalStyles.input_field]}
              ref={passwordRef}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={[loginStyle.backIcons]}
            >
              {!showPassword ? (
                <Ionicons
                  name="eye-outline"
                  size={20}
                  color={globalColors.primaryColor}
                />
              ) : (
                <Ionicons
                  name="eye-off-outline"
                  size={20}
                  color={globalColors.primaryColor}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[loginStyle.forgotTextBlock]}>
          <Link href="/forgot-password">
            <Text style={[loginStyle.forgotText]}>Forgot Password?</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          style={[
            globalStyles.primary_btn,
            isLoading && globalStyles.loadingBtnOpacity,
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Text style={[loginStyle.btnText]}>Signing in</Text>
              <Ionicons
                name="reload-outline"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          ) : (
            <>
              <Text style={[loginStyle.btnText]}>Sign In</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          )}
        </TouchableOpacity>

        <View style={[loginStyle.seperatorBlock]}>
          <View
            style={[globalStyles.seperator, globalStyles.globalFlex]}
          ></View>
          <Text style={[loginStyle.seperatorBlockText]}>or continue with</Text>
          <View
            style={[globalStyles.seperator, globalStyles.globalFlex]}
          ></View>
        </View>

        <TouchableOpacity
          style={[globalStyles.primary_btn, loginStyle.authBtn]}
        >
          <Ionicons
            name="logo-google"
            size={20}
            color={globalColors.grayDark}
          />
          <Text style={[loginStyle.authBtnText]}>Google</Text>
        </TouchableOpacity>

        <View style={[loginStyle.alternateBlock]}>
          <Text style={[loginStyle.alternateBlockText]}>
            Don't have an account?
          </Text>
          <TouchableOpacity>
            <Link href="/register">
              <Text style={[loginStyle.alternateBlockLink]}>SignUp</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </AuthLayout>
  );
};

export default LoginScreen;
