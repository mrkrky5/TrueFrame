import { Platform, type ViewStyle } from "react-native";

/** Flex child that can shrink so ScrollView gets a bounded height (web + native). */
export const flexScrollChild: ViewStyle = {
  flex: 1,
  minHeight: 0,
};

export const readerRoot: ViewStyle = {
  flex: 1,
  width: "100%",
  ...(Platform.OS === "web" ? { minHeight: 0 } : { overflow: "hidden" }),
};
