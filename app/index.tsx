import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const backgroundColor = useThemeColor({}, "background");

  const handleLogin = () => {
    router.push("/home");
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TextComponent type={TextType.headingLarge}>LOGIN</TextComponent>

      <Pressable style={styles.button} onPress={handleLogin}>
        <TextComponent type={TextType.textMediumSemiBold}>Entrar</TextComponent>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});
