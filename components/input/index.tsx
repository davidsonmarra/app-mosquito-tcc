import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { InputMask } from "./types";
import { formatText, unformatText } from "./utils";

export { InputMask };

export interface InputComponentProps extends TextInputProps {
  label?: string;
  prefix?: React.ReactNode;
  disabled?: boolean;
  mask?: InputMask;
  lightColor?: string;
  darkColor?: string;
}

const InputComponent = ({
  disabled = false,
  label,
  prefix,
  mask = InputMask.default,
  value,
  onChangeText,
  lightColor,
  darkColor,
  style,
  ...rest
}: InputComponentProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const borderColor = isFocused
    ? useThemeColor({}, "tint")
    : useThemeColor({}, "icon");
  const placeholderColor = useThemeColor({}, "icon");

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View style={styles.wrapper}>
      {label && (
        <TextComponent type={TextType.textSmallMedium} style={styles.label}>
          {label}
        </TextComponent>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor: disabled ? "#f5f5f5" : backgroundColor,
            borderColor: disabled ? "#e0e0e0" : borderColor,
          },
          !!prefix && styles.hasPrefix,
        ]}
      >
        {prefix && <View style={styles.prefixContainer}>{prefix}</View>}
        <TextInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, { color: textColor }, style]}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          placeholderTextColor={placeholderColor}
          value={formatText(value as string, mask)}
          onChangeText={(text) => onChangeText?.(unformatText(text, mask))}
          {...rest}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    marginBottom: 4,
  },
  container: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  hasPrefix: {
    paddingHorizontal: 8,
  },
  prefixContainer: {
    marginRight: 4,
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default InputComponent;
