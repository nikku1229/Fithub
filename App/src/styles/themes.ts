import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "@/utilities/responsive";

export const globalColors = {
  primaryColor: "#0F9D74",
  secondaryColor: "#FF7A45",
  backgroundLight: "#F7F8FA",
  backgroundDark: "#1E2023",
  grayLight: "#F0F0F0",
  grayDark: "#434039",

  darkBg_60: "rgba(0,0,0,0.60)",

  grayDark_50: "rgba(67, 64, 57, 0.5)",

  gradientLight: {
    color: ["#0F9D74", "#8CCEBC", "#F7F8FA"] as const,
    location: [0, 0.25, 0.5] as const,
  },
  gradientDark: {
    color: ["#FF7A45", "#9B4F32", "#723D2A", "#121417"] as const,
    location: [0, 0.1, 0.2, 0.72] as const,
  },
};

export const globalValues = {
  h1: responsiveWidth(28),
  h2: responsiveWidth(22),
  h3: responsiveWidth(18),
  h4: responsiveWidth(16),
  p: responsiveWidth(12),
};

export const globalStyles = StyleSheet.create({
  primary_btn: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: responsiveWidth(10),
    borderRadius: 10,
    gap: 5,
    backgroundColor: globalColors.primaryColor,
  },

  secondary_btn: {
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveWidth(10),
    borderRadius: 10,
    gap: 5,
    backgroundColor: globalColors.secondaryColor,
  },

  input_field: {
    paddingVertical: responsiveWidth(15),
    paddingHorizontal: responsiveHeight(40),
    alignItems: "center",
    backgroundColor: globalColors.backgroundLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: globalColors.primaryColor,
  },

  globalFlex: {
    flex: 1,
  },

  seperator: {
    height: 1,
    backgroundColor: globalColors.grayDark,
  },

  loadingBtnOpacity: {
    opacity: 0.8,
  },
});
