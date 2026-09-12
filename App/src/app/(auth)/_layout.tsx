import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" options={{ title: "Welcome Back" }} />
      <Stack.Screen name="register" options={{ title: "Create Account" }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "forgot Password" }}
      />
      <Stack.Screen name="username" options={{ title: "Set username" }} />
      <Stack.Screen name="otp" options={{ title: "Verify Otp" }} />
      <Stack.Screen
        name="reset-password"
        options={{ title: "Reset Password" }}
      />
    </Stack>
  );
}
