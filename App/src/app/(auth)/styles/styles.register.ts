import { globalColors, globalStyles, globalValues } from "@/styles/themes";
import { responsiveHeight, responsiveWidth } from "@/utilities/responsive";
import { StyleSheet } from "react-native";

const RegisterStyle = StyleSheet.create({
  btnContainer: {
    marginTop: responsiveHeight(15),
  },
  btnText: {
    fontSize: globalValues.h4,
    color: globalColors.backgroundLight,
  },
  TermsContainer: {
    paddingVertical: responsiveHeight(5),
    justifyContent: "center",
    alignItems: "center",
  },
  TermsText: {
    color: globalColors.grayDark_50,
  },
});

export default RegisterStyle;
