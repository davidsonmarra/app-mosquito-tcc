import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FormInput } from "@/components/form";
import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PersonalData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

export default function RegisterPersonalScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [formData, setFormData] = useState<PersonalData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        newErrors.phone = "Telefone deve ter pelo menos 10 dígitos";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    const phoneDigits = formData.phone.replace(/\D/g, "");
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password.length >= 6 &&
      formData.confirmPassword === formData.password &&
      formData.phone.trim() !== "" &&
      phoneDigits.length >= 10
    );
  };

  const handleNext = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navegar para próxima tela com dados
      router.push({
        pathname: "/register-address",
        params: {
          personalData: JSON.stringify(formData),
        },
      });
    } catch (error) {
      console.error("Erro ao navegar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={textColor} />
          </Pressable>
          <TextComponent type={TextType.headingLarge} style={styles.title}>
            Dados Pessoais
          </TextComponent>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
          </View>
          <TextComponent
            type={TextType.textSmallRegular}
            style={styles.progressText}
          >
            Etapa 1 de 3
          </TextComponent>
        </View>

        {/* Checklist de Validação */}
        <View style={[styles.checklistContainer, { backgroundColor }]}>
          <TextComponent
            type={TextType.textMediumSemiBold}
            style={styles.checklistTitle}
          >
            Complete os campos abaixo:
          </TextComponent>
          <View style={styles.checklist}>
            <View style={styles.checklistItem}>
              <MaterialIcons
                name={
                  formData.name.trim() !== ""
                    ? "check-circle"
                    : "radio-button-unchecked"
                }
                size={20}
                color={
                  formData.name.trim() !== "" ? "#4CAF50" : textColor + "80"
                }
              />
              <TextComponent
                type={TextType.textSmallRegular}
                style={[
                  styles.checklistText,
                  {
                    color:
                      formData.name.trim() !== ""
                        ? textColor
                        : textColor + "80",
                  },
                ]}
              >
                Nome
              </TextComponent>
            </View>

            <View style={styles.checklistItem}>
              <MaterialIcons
                name={
                  formData.email.trim() !== "" &&
                  /\S+@\S+\.\S+/.test(formData.email)
                    ? "check-circle"
                    : "radio-button-unchecked"
                }
                size={20}
                color={
                  formData.email.trim() !== "" &&
                  /\S+@\S+\.\S+/.test(formData.email)
                    ? "#4CAF50"
                    : textColor + "80"
                }
              />
              <TextComponent
                type={TextType.textSmallRegular}
                style={[
                  styles.checklistText,
                  {
                    color:
                      formData.email.trim() !== "" &&
                      /\S+@\S+\.\S+/.test(formData.email)
                        ? textColor
                        : textColor + "80",
                  },
                ]}
              >
                Email
              </TextComponent>
            </View>

            <View style={styles.checklistItem}>
              <MaterialIcons
                name={
                  formData.password.length >= 6 &&
                  formData.confirmPassword === formData.password &&
                  formData.password !== ""
                    ? "check-circle"
                    : "radio-button-unchecked"
                }
                size={20}
                color={
                  formData.password.length >= 6 &&
                  formData.confirmPassword === formData.password &&
                  formData.password !== ""
                    ? "#4CAF50"
                    : textColor + "80"
                }
              />
              <TextComponent
                type={TextType.textSmallRegular}
                style={[
                  styles.checklistText,
                  {
                    color:
                      formData.password.length >= 6 &&
                      formData.confirmPassword === formData.password &&
                      formData.password !== ""
                        ? textColor
                        : textColor + "80",
                  },
                ]}
              >
                Senhas iguais de pelo menos 6 dígitos
              </TextComponent>
            </View>

            <View style={styles.checklistItem}>
              <MaterialIcons
                name={
                  formData.phone.trim() !== "" &&
                  formData.phone.replace(/\D/g, "").length >= 10
                    ? "check-circle"
                    : "radio-button-unchecked"
                }
                size={20}
                color={
                  formData.phone.trim() !== "" &&
                  formData.phone.replace(/\D/g, "").length >= 10
                    ? "#4CAF50"
                    : textColor + "80"
                }
              />
              <TextComponent
                type={TextType.textSmallRegular}
                style={[
                  styles.checklistText,
                  {
                    color:
                      formData.phone.trim() !== "" &&
                      formData.phone.replace(/\D/g, "").length >= 10
                        ? textColor
                        : textColor + "80",
                  },
                ]}
              >
                Telefone válido
              </TextComponent>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              if (errors.name && text.trim()) {
                setErrors({ ...errors, name: undefined });
              }
            }}
            error={errors.name}
          />

          <FormInput
            label="Email"
            placeholder="Digite seu email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              if (errors.email && text.trim() && /\S+@\S+\.\S+/.test(text)) {
                setErrors({ ...errors, email: undefined });
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <FormInput
            label="Senha"
            placeholder="Digite sua senha"
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              if (errors.password && text.length >= 6) {
                setErrors({ ...errors, password: undefined });
              }
            }}
            secureTextEntry
            showPasswordToggle
            textContentType="none"
            autoComplete="off"
            passwordRules=""
            error={errors.password}
          />

          <FormInput
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            value={formData.confirmPassword}
            onChangeText={(text) => {
              setFormData({ ...formData, confirmPassword: text });
              if (errors.confirmPassword && text === formData.password) {
                setErrors({ ...errors, confirmPassword: undefined });
              }
            }}
            secureTextEntry
            showPasswordToggle
            textContentType="none"
            autoComplete="off"
            passwordRules=""
            error={errors.confirmPassword}
          />

          <FormInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChangeText={(text) => {
              setFormData({ ...formData, phone: text });
              if (errors.phone && text.trim()) {
                setErrors({ ...errors, phone: undefined });
              }
            }}
            keyboardType="phone-pad"
            error={errors.phone}
          />
        </View>
        </ScrollView>
        
        {/* Botão fixo na parte inferior */}
        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor,
              bottom: keyboardHeight > 0 ? keyboardHeight : 0,
            },
          ]}
        >
          <Pressable
            style={[
              styles.nextButton,
              {
                backgroundColor: isFormValid() ? textColor : textColor + "50",
                opacity: isFormValid() ? 1 : 0.6,
              },
            ]}
            onPress={handleNext}
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <TextComponent
                  type={TextType.textMediumSemiBold}
                  darkColor="#fff"
                  lightColor="#fff"
                >
                  Continuar
                </TextComponent>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Espaço para o botão fixo
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    flex: 1,
  },
  progressContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  progressBar: {
    flexDirection: "row",
    marginBottom: 8,
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: "#0a7ea4",
  },
  progressText: {
    opacity: 0.7,
  },
  form: {
    paddingHorizontal: 16,
    gap: 16,
  },
  checklistContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  checklistTitle: {
    marginBottom: 12,
  },
  checklist: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checklistText: {
    flex: 1,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
});
