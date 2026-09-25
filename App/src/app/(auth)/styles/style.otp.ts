import { StyleSheet } from "react-native";
import { globalColors, globalValues } from "@/styles/themes";
import { responsiveHeight, responsiveWidth } from "@/utilities/responsive";

const otpStyle = StyleSheet.create({
  otpFieldWrapper: {
    // width: "100%",
    gap: responsiveHeight(10),
  },
  boxesContainer: {
    // width: "100%",
    flexDirection: "row",
    justifyContent: "space-between", 
    paddingVertical: responsiveHeight(10),
  },

 otpBox: {
    width: responsiveWidth(46),
    height: responsiveHeight(54),
    borderWidth: 1.5,
    borderColor: globalColors.grayDark_50,
    borderRadius: 10,
    backgroundColor: globalColors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
  },
    otpBoxActive: {
    borderColor: globalColors.primaryColor, // Highlighting frame color when active
    borderWidth: 2,
  },

  otpBoxText: {
    fontSize: globalValues.h2,
    fontWeight: "bold",
    color: globalColors.backgroundDark,
  },

  hiddenTextInput: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0, 
  },
otpBoxInput: {
    width: responsiveWidth(44),
    height: responsiveHeight(52),
    borderWidth: 1,
    borderColor: globalColors.primaryColor,
    borderRadius: 8,
    backgroundColor: globalColors.backgroundLight,
    textAlign: "center",
    fontSize: globalValues.h3,
    fontWeight: "600",
    color: globalColors.backgroundDark,
  },

  otpBoxInputActive: {
    borderWidth: 2,
    borderColor: globalColors.primaryColor,
  },

  errorText: {
    fontSize: globalValues.p,
    color: globalColors.secondaryColor, // Maps to your error tint profile
    textAlign: "center",
    marginTop: responsiveHeight(2),
  }

});

export default otpStyle;