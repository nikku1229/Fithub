import { AuthLayout } from "@/components/auth/AuthLayout";
import { globalColors, globalStyles } from "@/styles/themes";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import loginStyle from "./styles/styles.login";
import forgotStyle from "./styles/styles.forgot";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import RegisterStyle from "./styles/styles.register";
import useAuthRegister from "./store/useAuth.register";

const UserNameScreen = () => {
  const { register, isLoading, error } = useAuthRegister();

  const [input, setInput] = useState({
    userName: "",
  });

  const { name, email, password } = useLocalSearchParams<{
    name: string;
    email: string;
    password: string;
  }>();

  const handleUser = () => {
    if(!UserNameScreen)
    return;
  router.push('/login')
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
              returnKeyType="done"
              blurOnSubmit={false}
              value={input.userName}
              onChangeText={(text) =>
                setInput((prev) => ({ ...prev, userName: text }))
              }
              style={[globalStyles.input_field]}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleUser}
          style={[globalStyles.primary_btn, RegisterStyle.btnContainer]}
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
          <Link href="/register" style={forgotStyle.backToLoginLink}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={globalColors.primaryColor}
            />
            <Text style={forgotStyle.backToLoginLinkText}>
              Edit Information
            </Text>
          </Link>
        </TouchableOpacity>
      </LinearGradient>
    </AuthLayout>
  );
};

export default UserNameScreen;
