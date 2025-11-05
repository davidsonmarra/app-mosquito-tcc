import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  showPasswordToggle?: boolean;
}

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  multiline = false,
  numberOfLines = 1,
  showPasswordToggle = false,
  ...rest
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = error ? "#ef4444" : useThemeColor({}, "icon");

  const isPasswordVisible = showPasswordToggle ? !showPassword : secureTextEntry;

  return (
    <View style={styles.container}>
      <TextComponent type={TextType.textMediumSemiBold} style={styles.label}>
        {label}
      </TextComponent>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor,
              color: textColor,
              borderColor,
            },
            multiline && styles.multilineInput,
            showPasswordToggle && styles.inputWithIcon,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={textColor + "80"}
          secureTextEntry={isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...rest}
        />
        {showPasswordToggle && (
          <Pressable
            style={styles.iconButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color={textColor + "80"}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <TextComponent type={TextType.textSmallRegular} style={styles.error}>
          {error}
        </TextComponent>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  iconButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  error: {
    color: "#ef4444",
    marginTop: 4,
  },
});
