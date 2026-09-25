import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputKeyPressEvent,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors, globalStyles } from "@/styles/themes";
import { Ionicons } from "@expo/vector-icons";
import loginStyle from "./styles/styles.login";
import forgotStyle from "./styles/styles.forgot";
import otpStyle from "./styles/style.otp";
import useAuthForgotStore from "./store/useAuth.forgot";

const OtpScreen = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");

  const isLoading = useAuthForgotStore((state) => state.isLoading);

  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));

  const handleOtpChange = (value: string, index: number): void => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);
    setError("");

    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: TextInputKeyPressEvent, index: number): void => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOtp = (): boolean => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit verification code");
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateOtp() || isLoading) return;
    setError("");

    try {
      const otpValue = otp.join("");
      console.log("Submitting 6-Digit Verification Code:", otpValue);
      router.push({
        pathname: "/(auth)/reset-password",
      });
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
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
          <Text style={forgotStyle.Heading}>Verify OTP</Text>
          <Text style={forgotStyle.inputfieldText}>
            We have sent a 6-digit verification code to your email. Enter it
            below to continue.
          </Text>
        </View>

        <View style={otpStyle.otpFieldWrapper}>
          <View style={otpStyle.boxesContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                placeholder="-"
                placeholderTextColor={globalColors.grayDark_50}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus={true}
                returnKeyType={index === 5 ? "done" : "next"}
                blurOnSubmit={index === 5}
                onSubmitEditing={() => {
                  if (index === 5) {
                    handleSubmit();
                  } else {
                    inputRefs.current[index + 1]?.focus();
                  }
                }}
                style={[
                  otpStyle.otpBoxInput,
                  digit ? otpStyle.otpBoxInputActive : null,
                ]}
              />
            ))}
          </View>
        </View>

        {error ? <Text style={otpStyle.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            globalStyles.primary_btn,
            isLoading && globalStyles.loadingBtnOpacity,
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Text style={loginStyle.btnText}>Loading...</Text>
              <Ionicons
                name="reload-outline"
                size={20}
                color={globalColors.backgroundLight}
              />
            </>
          ) : (
            <>
              <Text style={loginStyle.btnText}>Verify & Continue</Text>
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
            <Text style={forgotStyle.backToLoginLinkText}>Back</Text>
          </Link>
        </TouchableOpacity>
      </LinearGradient>
    </AuthLayout>
  );
};

export default OtpScreen;
