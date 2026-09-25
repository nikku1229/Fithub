import { StyleSheet } from "react-native";
import { globalColors, globalValues } from "@/styles/themes";
import { responsiveWidth, responsiveHeight } from "@/utilities/responsive";

const forgotStyle = StyleSheet.create({
  forgotextContainer: {
    gap: responsiveHeight(10),
  },
  Heading: {
    fontSize: globalValues.h2,
  },
  inputfieldText: {
    fontSize: globalValues.h4,
    lineHeight: globalValues.h4 * 1.1,
    color: globalColors.grayDark_70,
  },
  backToLoginLinkContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: responsiveHeight(12),
    paddingHorizontal: responsiveWidth(10),
  },
  backToLoginLinkText: {
    fontSize: globalValues.h4,
    color: globalColors.primaryColor,
    fontWeight: "500",
  },
  backToLoginLink: {
    gap: responsiveWidth(10),
  },
});

export default forgotStyle;
