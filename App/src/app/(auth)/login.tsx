import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import useAuthLogin from "./store/useAuth.login";
import LoginStyle from "./styles/styles.login";

const LoginScreen = () => {
  const router = useRouter();

  const { login, isLoading, error, user } = useAuthLogin();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    console.log("handle click clicked");
    if (!input.email.trim() || !input.password) return;

    const isLogin = await login(input);
    // if (isLogin) router.replace("/(tabs)");
    if (isLogin) console.log("Login successful"); // remove it when (tabs) is created
  };

  return (
    <View style={{ paddingTop: 100 }}>
      <Text>Pulse Fitness AI</Text>

      {user && <Text>{user.id}</Text>}
      {user && <Text>{user.email}</Text>}
      {user && <Text>{user.name}</Text>}
      {user && <Text>{user.username}</Text>}
      {error && <Text>{error}</Text>}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={input.email}
        onChangeText={(text) => setInput({ ...input, email: text })}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={input.password}
        onChangeText={(text) => setInput({ ...input, password: text })}
      />

      <TouchableOpacity onPress={handleLogin}>
        <Text>Sign In</Text>
      </TouchableOpacity>

      <View>
        <Link href="/register" asChild>
          <TouchableOpacity>
            <Text>Create Account</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/username" asChild>
          <TouchableOpacity>
            <Text>Set username</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/forgot-password" asChild>
          <TouchableOpacity>
            <Text>Forgot Password?</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default LoginScreen;
