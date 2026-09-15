import { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import useAuthLogin from "./store/useAuth.login";
import loginStyle from "./styles/styles.login";
import { globalColors, globalStyles } from "@/styles/themes";

const LoginScreen = () => {
  const router = useRouter();

  const { login, isLoading, error } = useAuthLogin();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!input.email.trim() || !input.password) return;

    const isLogin = await login(input);
    // if (isLogin) router.replace("/(tabs)");
    if (isLogin) console.log("Login successful"); // remove it when (tabs) is created
  };

  return (
    <AuthLayout>
      <LinearGradient
        colors={globalColors.gradientLight.color}
        locations={globalColors.gradientLight.location}
        style={[loginStyle.formContainer]}
      >
        <KeyboardAvoidingView style={[loginStyle.keyboardLayoutContainer]}>
          <View style={[loginStyle.inputFieldContainer]}>
            <Text style={[loginStyle.inputFieldLabel]}>Email</Text>
            <View style={[loginStyle.inputWrapper]}>
              <MaterialIcons
                name="email"
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
                value={input.email}
                onChangeText={(text) => setInput({ ...input, email: text })}
                style={[globalStyles.input_field]}
              />
            </View>
          </View>

          <View style={[loginStyle.inputFieldContainer]}>
            <Text style={[loginStyle.inputFieldLabel]}>Password</Text>
            <View style={[loginStyle.inputWrapper]}>
              <MaterialIcons
                name="shield"
                size={20}
                color={globalColors.primaryColor}
                style={[loginStyle.frontIcons]}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={globalColors.grayDark_50}
                secureTextEntry={showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                accessible={true}
                accessibilityLabel="Password input field"
                accessibilityHint="Enter your password"
                accessibilityRole="text"
                value={input.password}
                onChangeText={(text) => setInput({ ...input, password: text })}
                style={[globalStyles.input_field]}
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
            style={[globalStyles.primary_btn]}
          >
            <Text style={[loginStyle.btnText]}>Sign In</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={globalColors.backgroundLight}
            />
          </TouchableOpacity>

          <View style={[loginStyle.seperatorBlock]}>
            <View
              style={[globalStyles.seperator, globalStyles.globalFlex]}
            ></View>
            <Text style={[loginStyle.seperatorBlockText]}>
              or continue with
            </Text>
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
        </KeyboardAvoidingView>
      </LinearGradient>
    </AuthLayout>

    // <Link href="/register" asChild>
    //   <TouchableOpacity>
    //     <Text>Create Account</Text>
    //   </TouchableOpacity>
    // </Link>
    // <Link href="/username" asChild>
    //   <TouchableOpacity>
    //     <Text>Set username</Text>
    //   </TouchableOpacity>
    // </Link>
    // <Link href="/forgot-password" asChild>
    //   <TouchableOpacity>
    //     <Text>Forgot Password?</Text>
    //   </TouchableOpacity>
    // </Link>
  );
};

export default LoginScreen;
