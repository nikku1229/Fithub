import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import RegisterStyle from "./styles/styles.register";
import { LinearGradient } from "expo-linear-gradient";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { globalColors, globalStyles } from "@/styles/themes";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import useAuthRegister from "./store/useAuth.register";
import loginStyle from "./styles/styles.login";
import { Link, useRouter } from "expo-router";

const RegisterScreen = () => {
  const router = useRouter();

  const { register, isLoading, error } = useAuthRegister();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      console.log("Register Page Error:", error);
      //Toast apply
    }
  }, [error]);

  const handleRegister = async () => {
    if (!input.name.trim() || !input.email.trim() || !input.password.trim())
      return;

    const isRegister = await register(input);
    if (isRegister) {
      setInput({ name: "", email: "", password: "" });
      console.log("Register successful");
      router.navigate("/username");
    }
  };

  return (
    <AuthLayout>
      <LinearGradient
        colors={globalColors.gradientLight.color}
        locations={globalColors.gradientLight.location}
        style={[loginStyle.formContainer, loginStyle.keyboardLayoutContainer]}
      >
        <View style={loginStyle.inputFieldContainer}>
          <Text style={loginStyle.inputFieldLabel}>Name</Text>
          <View style={loginStyle.inputWrapper}>
            <Feather
              name="user"
              size={20}
              color={globalColors.primaryColor}
              style={loginStyle.frontIcons}
            />
            <TextInput
              placeholder="Name"
              keyboardType="name-phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="name"
              textContentType="name"
              placeholderTextColor={globalColors.grayDark_50}
              accessible={true}
              accessibilityLabel="Name Input Field"
              accessibilityHint="Enter Your Name"
              accessibilityRole="text"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => emailRef.current?.focus()}
              value={input.name}
              onChangeText={(text) =>
                setInput((prev) => ({ ...prev, name: text }))
              }
              style={[globalStyles.input_field]}
            />
          </View>
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
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
              value={input.email}
              onChangeText={(text) =>
                setInput((prev) => ({ ...prev, email: text }))
              }
              style={[globalStyles.input_field]}
              ref={emailRef}
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
              onSubmitEditing={handleRegister}
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

        <TouchableOpacity
          onPress={handleRegister}
          style={[
            globalStyles.primary_btn,
            RegisterStyle.btnContainer,
            isLoading && globalStyles.loadingBtnOpacity,
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Text style={[RegisterStyle.btnText]}>Creating Account</Text>
              <Ionicons
                name="reload-outline"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          ) : (
            <>
              <Text style={[RegisterStyle.btnText]}>Create Account</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          )}
        </TouchableOpacity>

        <View style={RegisterStyle.TermsContainer}>
          <Text style={RegisterStyle.TermsText}>
            By Creating an account, You agree to
          </Text>
          <Text style={RegisterStyle.TermsText}>
            our Terms and Privacy Policy.
          </Text>
        </View>

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
            Already have an account?
          </Text>
          <TouchableOpacity>
            <Link href="/login">
              <Text style={[loginStyle.alternateBlockLink]}>Login</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </AuthLayout>
  );
};

export default RegisterScreen;
