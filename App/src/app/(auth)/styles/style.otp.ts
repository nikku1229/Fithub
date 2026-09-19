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


});

export default otpStyle;