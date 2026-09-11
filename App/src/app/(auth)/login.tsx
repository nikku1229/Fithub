import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';

const LoginScreen = () => {
    const router=useRouter();
  return (
     <View >
      <Text >Pulse Fitness AI</Text>
      
      <TextInput  placeholder="Email" placeholderTextColor="#aaa" />
      <TextInput placeholder="Password" placeholderTextColor="#aaa" secureTextEntry />

      <Pressable >
        <Text >Sign In</Text>
      </Pressable>

      <View >
        <Link href="/register" asChild>
          <Pressable><Text>Create Account</Text></Pressable>
        </Link>
        <Link href="/username" asChild>
          <Pressable><Text>Set username</Text></Pressable>
        </Link>
        <Link href="/forgot-password" asChild>
          <Pressable><Text >Forgot Password?</Text></Pressable>
        </Link>
      </View>
    </View>
  )
}

export default LoginScreen