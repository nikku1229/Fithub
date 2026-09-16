import { StyleSheet } from "react-native";
import { globalColors, globalValues } from "@/styles/themes";
import { responsiveWidth, responsiveHeight } from "@/utilities/responsive";

const loginStyle = StyleSheet.create({
  formContainer: {
    paddingHorizontal: responsiveWidth(20),
    paddingTop: responsiveHeight(35),
    paddingBottom: responsiveHeight(35),
    flex: 1,
    gap: responsiveHeight(10),
    borderTopLeftRadius: responsiveWidth(20),
    borderTopRightRadius: responsiveHeight(20),
    borderBottomLeftRadius: responsiveWidth(0),
    borderBottomRightRadius: responsiveHeight(0),
  },

  keyboardLayoutContainer: {
    gap: responsiveHeight(10),
    flex: 1,
  },

  inputFieldContainer: {
    gap: 2,
  },

  inputFieldLabel: {
    fontSize: globalValues.h4,
    color: globalColors.backgroundDark,
  },

  inputWrapper: {
    position: "relative",
  },

  frontIcons: {
    position: "absolute",
    left: responsiveWidth(20),
    top: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    zIndex: 1,
  },

  backIcons: {
    position: "absolute",
    right: responsiveWidth(5),
    top: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    zIndex: 1,
  },

  forgotTextBlock: {
    width: "100%",
    alignItems: "flex-end",
  },

  forgotText: {
    color: globalColors.primaryColor,
    textDecorationLine: "underline",
    fontSize: globalValues.h4,
  },

  btnText: {
    fontSize: globalValues.h4,
    color: globalColors.backgroundLight,
  },

  seperatorBlock: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingVertical: 10,
  },

  seperatorBlockText: {
    flex: 1.2,
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: globalValues.p,
    color: globalColors.grayDark,
  },

  authBtn: {
    backgroundColor: globalColors.backgroundLight,
    borderWidth: 1,
    borderColor: globalColors.grayDark,
  },

  authBtnText: {
    fontSize: globalValues.h4,
    color: globalColors.grayDark,
  },

  alternateBlock: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    paddingTop: 5,
  },

  alternateBlockText: {
    color: globalColors.grayDark,
  },

  alternateBlockLink: {
    textDecorationLine: "underline",
    fontWeight: "500",
    color: globalColors.backgroundDark,
  },
});

export default loginStyle;
