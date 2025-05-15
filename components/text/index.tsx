import React from "react";
import { Text as RNText, StyleSheet, TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export enum TextType {
  textSmallRegular = "textSmallRegular",
  textSmallMedium = "textSmallMedium",
  textSmallSemiBold = "textSmallSemiBold",
  textSmallHyperlink = "textSmallHyperlink",
  textSmallOverline = "textSmallOverline",
  textMediumRegular = "textMediumRegular",
  textMediumMedium = "textMediumMedium",
  textMediumSemiBold = "textMediumSemiBold",
  textMediumHyperlink = "textMediumHyperlink",
  textMediumOverline = "textMediumOverline",
  textLargeRegular = "textLargeRegular",
  textLargeMedium = "textLargeMedium",
  textLargeSemiBold = "textLargeSemiBold",
  textLargeHyperlink = "textLargeHyperlink",
  textLargeOverline = "textLargeOverline",
  headingXSmall = "headingXSmall",
  headingSmall = "headingSmall",
  headingMedium = "headingMedium",
  headingLarge = "headingLarge",
}

export type TextComponentProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type: TextType;
};

const TextComponent = ({
  children,
  type,
  style,
  lightColor,
  darkColor,
  ...rest
}: TextComponentProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const textStyle = {
    [TextType.textSmallRegular]: [styles.small, styles.regular],
    [TextType.textSmallMedium]: [styles.small, styles.mediumW],
    [TextType.textSmallSemiBold]: [styles.small, styles.semiBold],
    [TextType.textSmallHyperlink]: [styles.small, styles.hyperlink],
    [TextType.textSmallOverline]: [styles.small, styles.overline],
    [TextType.textMediumRegular]: [styles.medium, styles.regular],
    [TextType.textMediumMedium]: [styles.medium, styles.mediumW],
    [TextType.textMediumSemiBold]: [styles.medium, styles.semiBold],
    [TextType.textMediumHyperlink]: [styles.medium, styles.hyperlink],
    [TextType.textMediumOverline]: [styles.medium, styles.overline],
    [TextType.textLargeRegular]: [styles.large, styles.regular],
    [TextType.textLargeMedium]: [styles.large, styles.mediumW],
    [TextType.textLargeSemiBold]: [styles.large, styles.semiBold],
    [TextType.textLargeHyperlink]: [styles.large, styles.hyperlink],
    [TextType.textLargeOverline]: [styles.large, styles.overline],
    [TextType.headingXSmall]: styles.headingXSmall,
    [TextType.headingSmall]: styles.headingSmall,
    [TextType.headingMedium]: styles.headingMedium,
    [TextType.headingLarge]: styles.headingLarge,
  };

  return (
    <RNText style={[{ color }, textStyle[type], style]} {...rest}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  small: {
    fontSize: 12,
    lineHeight: 16,
  },
  medium: {
    fontSize: 14,
    lineHeight: 20,
  },
  large: {
    fontSize: 16,
    lineHeight: 24,
  },
  regular: {
    fontWeight: "400",
  },
  mediumW: {
    fontWeight: "500",
  },
  semiBold: {
    fontWeight: "600",
  },
  hyperlink: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  overline: {
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headingXSmall: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 16,
  },
  headingSmall: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
  },
  headingMedium: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
  },
  headingLarge: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
  },
});

export default TextComponent;
