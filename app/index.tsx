import InputComponent from "@/components/input";
import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { UserService } from "@/services/user";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getFriendlyErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error)) {
      return "Ops! Algo deu errado. Tente novamente.";
    }

    const errorMessage = error.message.toLowerCase();

    // Erros de credenciais
    if (
      errorMessage.includes("credenciais") ||
      errorMessage.includes("email") ||
      errorMessage.includes("senha") ||
      errorMessage.includes("password") ||
      errorMessage.includes("invalid") ||
      errorMessage.includes("incorrect") ||
      errorMessage.includes("401") ||
      errorMessage.includes("unauthorized")
    ) {
      return "Email ou senha incorretos. Verifique suas credenciais e tente novamente.";
    }

    // Erros de rede
    if (
      errorMessage.includes("network") ||
      errorMessage.includes("fetch") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("failed to fetch")
    ) {
      return "Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.";
    }

    // Erros de servidor
    if (
      errorMessage.includes("500") ||
      errorMessage.includes("server") ||
      errorMessage.includes("internal")
    ) {
      return "O servidor está temporariamente indisponível. Tente novamente em alguns instantes.";
    }

    // Erros de usuário não encontrado
    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("404") ||
      errorMessage.includes("usuário") ||
      errorMessage.includes("user")
    ) {
      return "Usuário não encontrado. Verifique se o email está correto ou crie uma conta.";
    }

    // Erro genérico amigável
    return "Não foi possível fazer login. Verifique suas credenciais e tente novamente.";
  };

  const handleLogin = async () => {
    // Validação básica
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    // Validação de email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, digite um email válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await UserService.login(email, password);
      router.push("/(tabs)/home");
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={[styles.keyboardAvoidingView, { backgroundColor }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, { backgroundColor }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <TextComponent type={TextType.headingLarge}>
              Faça seu Login
            </TextComponent>

            <View style={styles.form}>
              <InputComponent
                label="Email"
                placeholder="Digite seu email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.passwordWrapper}>
                <View style={styles.passwordInputContainer}>
                  <InputComponent
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (error) setError("");
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    textContentType="none"
                    autoComplete="off"
                    passwordRules=""
                    style={styles.passwordInput}
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={24}
                      color={textColor + "80"}
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            {error ? (
              <View
                style={[styles.errorContainer, { backgroundColor: "#ffebee" }]}
              >
                <MaterialIcons name="error-outline" size={20} color="#c62828" />
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    minHeight: "100%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  form: {
    width: "100%",
    marginVertical: 30,
    gap: 20,
  },
  passwordWrapper: {
    width: "100%",
  },
  passwordInputContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 28,
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
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
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    gap: 8,
  },
  errorText: {
    color: "#c62828",
    flex: 1,
  },
});
