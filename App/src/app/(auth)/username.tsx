import { useEffect, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { globalColors, globalStyles } from "@/styles/themes";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import loginStyle from "./styles/styles.login";
import forgotStyle from "./styles/styles.forgot";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import RegisterStyle from "./styles/styles.register";
import useAuthUsername from "./store/useAuth.username";
import useAuthLogin from "./store/useAuth.login";

const UserNameScreen = () => {
  const router = useRouter();
  const { loginEmail, loginPassword, fromLogin } = useLocalSearchParams<{
    loginEmail: string;
    loginPassword: string;
    fromLogin: string;
  }>();

  const { setUsername, isLoading, error } = useAuthUsername();
  const { login } = useAuthLogin();

  const [input, setInput] = useState({
    username: "",
  });

  useEffect(() => {
    if (error) {
      console.log("Username Page Error:", error);
      //Toast apply
    }
  }, [error]);

  const handleUsername = async () => {
    if (!input.username.trim()) return;

    const isUsernameSet = await setUsername(input);
    if (isUsernameSet) {
      setInput({ username: "" });
      console.log("Username set successful");

      if (fromLogin === "true") {
        const loginInput = { email: loginEmail, password: loginPassword };

        const isLogin = await login(loginInput);
        if (isLogin) {
          console.log("Login successful");
          // router.replace("/(tabs)");
        } else {
          console.log("Something went wrong");
          router.replace("/login");
        }
      }
    }
  };

  return (
    <AuthLayout>
      <LinearGradient
        colors={globalColors.gradientLight.color}
        locations={globalColors.gradientLight.location}
        style={[loginStyle.formContainer, loginStyle.keyboardLayoutContainer]}
      >
        <View style={forgotStyle.forgotextContainer}>
          <Text style={forgotStyle.Heading}>Set your username</Text>

          <Text style={forgotStyle.inputfieldText}>
            Set your username to get a unique identification in your profile.
          </Text>
        </View>

        <View style={[loginStyle.inputFieldContainer]}>
          <Text style={[loginStyle.inputFieldLabel]}>Username</Text>
          <View style={[loginStyle.inputWrapper]}>
            <FontAwesome6
              name="user"
              size={20}
              color={globalColors.primaryColor}
              style={[loginStyle.frontIcons]}
            />
            <TextInput
              placeholder="UserName"
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              placeholderTextColor={globalColors.grayDark_50}
              accessible={true}
              accessibilityLabel="Username Field"
              accessibilityHint="Enter your Username"
              accessibilityRole="text"
              returnKeyType="send"
              blurOnSubmit={true}
              value={input.username}
              onSubmitEditing={handleUsername}
              onChangeText={(text) =>
                setInput((prev) => ({ ...prev, username: text }))
              }
              style={[globalStyles.input_field]}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleUsername}
          style={[
            globalStyles.primary_btn,
            RegisterStyle.btnContainer,
            isLoading && globalStyles.loadingBtnOpacity,
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Text style={[loginStyle.btnText]}>Creating User</Text>
              <Ionicons
                name="reload-outline"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          ) : (
            <>
              <Text style={[loginStyle.btnText]}>Confirm</Text>
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
            <Text style={forgotStyle.backToLoginLinkText}>Back to login</Text>
          </Link>
        </TouchableOpacity>
      </LinearGradient>
    </AuthLayout>
  );
};

export default UserNameScreen;
