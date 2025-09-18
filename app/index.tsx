import InputComponent from "@/components/input";
import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.push("/(tabs)/home");
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TextComponent type={TextType.headingLarge}>Faça seu Login</TextComponent>

      <View style={styles.form}>
        <InputComponent
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputComponent
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <Pressable style={styles.button} onPress={handleLogin}>
        <TextComponent type={TextType.textMediumSemiBold}>Entrar</TextComponent>
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <TextComponent
          type={TextType.textSmallRegular}
          style={styles.dividerText}
        >
          ou
        </TextComponent>
        <View style={styles.dividerLine} />
      </View>

      <Pressable
        style={styles.registerButton}
        onPress={() => router.push("/register-personal")}
      >
        <TextComponent type={TextType.textMediumSemiBold}>
          Criar nova conta
        </TextComponent>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  form: {
    width: "100%",
    marginVertical: 30,
    gap: 20,
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.7,
  },
  registerButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
});
