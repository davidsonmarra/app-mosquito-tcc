import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
  const [formData, setFormData] = useState<PersonalData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Errors>({});

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password.length >= 6 &&
      formData.confirmPassword === formData.password &&
      formData.phone.trim() !== ""
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    gap: 8,
  },
});
