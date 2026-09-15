import { StyleSheet } from "react-native";
import { globalColors, globalValues } from "@/styles/themes";

const authLayoutStyle = StyleSheet.create({
  authLayoutContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: globalColors.darkBg_60,
    justifyContent: "flex-end",
    gap: 20,
  },

  authLayoutTopHeader: {
    paddingVertical: 20,
    width: "100%",
    alignItems: "center",
  },

  authLayoutTopHeaderLogoContainer: {
    width: 100,
    height: 100,
    padding: 15,
    marginBottom: 15,
    borderRadius: 50,
    backgroundColor: globalColors.backgroundLight,
  },

  authLayoutTopHeaderLogo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  authLayoutTopHeaderHeading: {
    fontSize: globalValues.h2,
    color: globalColors.backgroundLight,
  },

  authLayoutTopHeaderText: {
    fontSize: globalValues.h4,
    color: globalColors.grayLight,
  },

  authFormSection: {
    minHeight: "62%",
    maxHeight: "90%",
  },
});

export default authLayoutStyle;
