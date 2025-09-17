import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CEPInput, FormInput } from "@/components/form";
import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GoogleMapsService } from "@/services/googleMaps";
import { ViaCEPAddress } from "@/services/viacep";

interface AddressData {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  lat: number;
  lng: number;
}

interface Errors {
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
}

export default function RegisterAddressScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressData>({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
    lat: 0,
    lng: 0,
  });
  const [errors, setErrors] = useState<Errors>({});

  const { personalData } = useLocalSearchParams();

  // Verificar se personalData existe
  if (!personalData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <TextComponent
            type={TextType.headingMedium}
            style={styles.errorTitle}
          >
            Erro
          </TextComponent>
          <TextComponent
            type={TextType.textMediumRegular}
            style={styles.errorMessage}
          >
            Dados pessoais não encontrados. Por favor, volte e preencha
            novamente.
          </TextComponent>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={textColor} />
            <TextComponent type={TextType.textMediumSemiBold}>
              Voltar
            </TextComponent>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
    } else {
      const cleanCEP = formData.cep.replace(/\D/g, "");
      if (cleanCEP.length !== 8) {
        newErrors.cep = "CEP deve ter 8 dígitos";
      }
    }

    if (!formData.street.trim()) {
      newErrors.street = "Rua é obrigatória";
    }

    if (!formData.number.trim()) {
      newErrors.number = "Número é obrigatório";
    }

    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = "Bairro é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    const cleanCEP = formData.cep.replace(/\D/g, "");
    return (
      formData.cep.trim() !== "" &&
      cleanCEP.length === 8 &&
      formData.street.trim() !== "" &&
      formData.number.trim() !== "" &&
      formData.neighborhood.trim() !== ""
    );
  };

  const handleCEPChange = (cep: string) => {
    setFormData({ ...formData, cep });
  };

  const handleNext = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      // Buscar coordenadas REAIS do Google Maps antes de continuar
      console.log("🎯 Buscando coordenadas finais antes de continuar...");

      const finalCoordinates = await GoogleMapsService.getFinalCoordinates(
        formData.street,
        formData.number,
        formData.neighborhood,
        "Belo Horizonte", // Seria melhor pegar da resposta do CEP
        "MG",
        formData.cep
      );

      let finalFormData = formData;

      if (finalCoordinates) {
        // Atualizar coordenadas finais
        finalFormData = {
          ...formData,
          lat: finalCoordinates.latitude,
          lng: finalCoordinates.longitude,
        };

        console.log("✅ Coordenadas finais obtidas:", finalCoordinates);
      } else {
        console.log(
          "⚠️ Não foi possível obter coordenadas finais, usando as atuais"
        );
      }

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navegar para tela de revisão com todos os dados
      const allData = {
        personalData: JSON.parse(personalData as string),
        addressData: finalFormData,
      };

      router.push({
        pathname: "/register-review",
        params: {
          allData: JSON.stringify(allData),
        },
      });
    } catch (error) {
      console.error("Erro ao navegar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color={textColor} />
          </Pressable>
          <TextComponent type={TextType.headingLarge} style={styles.title}>
            Endereço
          </TextComponent>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.progressStepCompleted]} />
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={styles.progressStep} />
          </View>
          <TextComponent
            type={TextType.textSmallRegular}
            style={styles.progressText}
          >
            Etapa 2 de 3
          </TextComponent>
        </View>

        <View style={styles.form}>
          <CEPInput
            value={formData.cep}
            onChangeText={handleCEPChange}
            streetNumber={formData.number}
            onAddressFound={(address: ViaCEPAddress) => {
              setFormData((prev) => ({
                ...prev,
                street: address.street,
                neighborhood: address.neighborhood,
              }));

              console.log(
                "✅ Endereço encontrado no ViaCEP (GRATUITO):",
                address
              );
            }}
            error={errors.cep}
          />

          <FormInput
            label="Rua"
            placeholder="Digite o nome da rua"
            value={formData.street}
            onChangeText={(text) => setFormData({ ...formData, street: text })}
            error={errors.street}
          />

          <FormInput
            label="Número"
            placeholder="Digite o número"
            value={formData.number}
            onChangeText={(text) => setFormData({ ...formData, number: text })}
            keyboardType="numeric"
            error={errors.number}
          />

          <FormInput
            label="Bairro"
            placeholder="Digite o bairro"
            value={formData.neighborhood}
            onChangeText={(text) =>
              setFormData({ ...formData, neighborhood: text })
            }
            error={errors.neighborhood}
          />

          <FormInput
            label="Complemento"
            placeholder="Apartamento, casa, etc. (opcional)"
            value={formData.complement}
            onChangeText={(text) =>
              setFormData({ ...formData, complement: text })
            }
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.backButtonAction, { borderColor: textColor + "30" }]}
            onPress={handleBack}
          >
            <MaterialIcons name="arrow-back" size={20} color={textColor} />
            <TextComponent type={TextType.textMediumSemiBold}>
              Voltar
            </TextComponent>
          </Pressable>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
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
  progressStepCompleted: {
    backgroundColor: "#10b981",
  },
  progressText: {
    opacity: 0.7,
  },
  form: {
    paddingHorizontal: 16,
    gap: 16,
  },
  locationSection: {
    marginTop: 8,
  },
  locationLabel: {
    marginBottom: 12,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    gap: 12,
  },
  backButtonAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  nextButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
});
