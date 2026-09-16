import { StyleSheet } from "react-native";
import { globalColors, globalValues } from "@/styles/themes";
import { responsiveHeight, responsiveWidth } from "@/utilities/responsive";

const authLayoutStyle = StyleSheet.create({
  authLayoutContainer: {
    backgroundColor: globalColors.darkBg_60,
    justifyContent: "flex-end",
    gap: responsiveHeight(20),
  },

  authLayoutTopHeader: {
    paddingVertical: responsiveWidth(10),
    width: "100%",
    alignItems: "center",
  },

  authLayoutTopHeaderLogoContainer: {
    width: responsiveWidth(70),
    height: responsiveHeight(70),
    padding: responsiveWidth(8),
    marginBottom: responsiveHeight(15),
    borderRadius: responsiveWidth(50),
    backgroundColor: globalColors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
  },

  authLayoutTopHeaderLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  authLayoutTopHeaderHeading: {
    fontSize: globalValues.h3,
    color: globalColors.backgroundLight,
  },

  authLayoutTopHeaderText: {
    fontSize: globalValues.h4,
    color: globalColors.grayLight,
  },
});

export default authLayoutStyle;
