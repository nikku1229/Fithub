import { StyleSheet } from "react-native";
import { globalColors, globalValues } from "@/styles/themes";

const loginStyle = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  keyboardLayoutContainer: {
    gap: 12,
  },

  inputFieldContainer: {
    gap: 2,
    width: "100%",
  },

  inputFieldLabel: {
    fontSize: globalValues.h4,
    color: globalColors.backgroundDark,
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  frontIcons: {
    position: "absolute",
    left: 15,
    top: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    zIndex: 1,
  },

  backIcons: {
    position: "absolute",
    right: 15,
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
    flex: 1,
    textTransform: "uppercase",
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
