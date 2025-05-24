import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TextComponent type={TextType.headingLarge}>
        Detector de Focos da Dengue
      </TextComponent>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.logoutButton]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="logout" size={24} color="#fff" />
          <TextComponent
            type={TextType.textMediumSemiBold}
            darkColor="#fff"
            lightColor="#fff"
          >
            Sair
          </TextComponent>
        </Pressable>

        <Pressable
          style={[styles.button, styles.cameraButton]}
          onPress={() => router.push("/camera")}
        >
          <MaterialIcons name="camera-alt" size={24} color="#fff" />
          <TextComponent
            type={TextType.textMediumSemiBold}
            darkColor="#fff"
            lightColor="#fff"
          >
            Tirar Foto
          </TextComponent>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 32,
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
  },
  cameraButton: {
    backgroundColor: "#0a7ea4",
  },
});
