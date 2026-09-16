import { Dimensions } from "react-native";

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const { width, height } = Dimensions.get("window");

export const responsiveWidth = (value: number) => {
  return (width / BASE_WIDTH) * value;
};

export const responsiveHeight = (value: number) => {
  return (height / BASE_HEIGHT) * value;
};
