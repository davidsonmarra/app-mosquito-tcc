import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  style?: ViewStyle;
}

export default function FloatingActionButton({
  onPress,
  icon = "camera-alt",
  size = 24,
  style,
}: FloatingActionButtonProps) {
  const backgroundColor = useThemeColor({}, "tint");

  return (
    <Pressable
      style={[styles.fab, { backgroundColor }, style]}
      onPress={onPress}
      android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={size} color="#fff" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
