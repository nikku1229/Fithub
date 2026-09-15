import { StyleSheet } from "react-native";

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
  h1: 28,
  h2: 22,
  h3: 18,
  h4: 16,
  p: 12,
};

export const globalStyles = StyleSheet.create({
  primary_btn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    gap: 5,
    backgroundColor: globalColors.primaryColor,
  },

  secondary_btn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    gap: 5,
    backgroundColor: globalColors.secondaryColor,
  },

  input_field: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 30,
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
});
