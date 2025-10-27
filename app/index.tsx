import InputComponent from "@/components/input";
import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { UserService } from "@/services/user";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export default function LoginScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // Validação básica
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await UserService.login(email, password);
      router.push("/(tabs)/home");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
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
          textContentType="none"
          autoComplete="off"
          passwordRules=""
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <TextComponent
            type={TextType.textSmallRegular}
            style={styles.errorText}
          >
            {error}
          </TextComponent>
        </View>
      ) : null}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <TextComponent type={TextType.textMediumSemiBold}>
            Entrar
          </TextComponent>
        )}
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
  buttonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  errorText: {
    color: "#c62828",
  },
});
