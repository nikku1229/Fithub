import { View, Text, TextInput, TouchableOpacity, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors, globalStyles } from "@/styles/themes";
import loginStyle from "./styles/styles.login";
import forgotStyle from "./styles/styles.forgot";
import otpStyle from "./styles/style.otp";

const OtpScreen = () => {
  const [otp, SetOtp] = useState("");
    const inputRef = useRef<TextInput>(null);
 const boxArray = new Array(6).fill(0);

  const handlePressBoxes = () => {
    inputRef.current?.focus();
  };

  return (
    <AuthLayout>
      <LinearGradient
        colors={globalColors.gradientLight.color}
        locations={globalColors.gradientLight.location}
        style={[loginStyle.formContainer, loginStyle.keyboardLayoutContainer]}
      >
        <View style={forgotStyle.forgotextContainer}>
          <Text style={forgotStyle.Heading}>Verify OTP</Text>

          <Text style={forgotStyle.inputfieldText}>
            We have sent you a 6 digit to your email. Enter it below to continue
          </Text>
        </View>

        <View>
            <View style={otpStyle.otpFieldWrapper}>
<Pressable  onPress={handlePressBoxes} style={otpStyle.boxesContainer}>
            {boxArray.map((_, index) => {
              const char = otp[index] || ""; // Get the character at this specific slot position
              const isFocused = index === otp.length; // Visually highlight the current active text slot

              return (
                <View 
                  key={index} 
                  style={[
                    otpStyle.otpBox, 
                    isFocused && otpStyle.otpBoxActive
                  ]}
                >
                  <Text style={otpStyle.otpBoxText}>{char}</Text>
                </View>
              );
            })}
  </Pressable>
           <TextInput
              placeholder="000000"
              keyboardType="number-pad" 
              maxLength={6} 
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="oneTimeCode" 
              placeholderTextColor={globalColors.grayDark_50}
              accessible={true}
              accessibilityLabel="OTP Verification Input Field"
              accessibilityHint="Enter the 6 digit code received in your email"
              accessibilityRole="text"
              returnKeyType="done"
              blurOnSubmit={true}
              value={otp}
              onChangeText={(text) => SetOtp(text)}

            />
            
            </View>

        </View>
      </LinearGradient>
    </AuthLayout>
  );
};

export default OtpScreen;
