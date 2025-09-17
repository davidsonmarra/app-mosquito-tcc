import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { User } from "@/types/User";

interface PersonalData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface AddressData {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  lat: number;
  lng: number;
}

interface AllData {
  personalData: PersonalData;
  addressData: AddressData;
}

export default function RegisterReviewScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const [loading, setLoading] = useState(false);

  const { allData } = useLocalSearchParams();

  // Verificar se allData existe
  if (!allData) {
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
            Dados não encontrados. Por favor, volte e preencha novamente.
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

  const data: AllData = JSON.parse(allData as string);

  const handleRegister = async () => {
    setLoading(true);

    try {
      // Montar dados do usuário conforme especificação
      const userData: User = {
        name: data.personalData.name,
        email: data.personalData.email,
        password: data.personalData.password,
        phone: data.personalData.phone,
        address: {
          cep: data.addressData.cep.replace(/\D/g, ""), // Remove formatação do CEP
          street: data.addressData.street,
          number: parseInt(data.addressData.number),
          neighborhood: data.addressData.neighborhood,
          complement: data.addressData.complement || undefined,
          lat: data.addressData.lat,
          lng: data.addressData.lng,
        },
      };

      // Print do objeto final completo
      console.log("=== DADOS FINAIS DO CADASTRO ===");
      console.log("Dados pessoais:", data.personalData);
      console.log("Dados de endereço:", data.addressData);
      console.log("Coordenadas capturadas:", {
        latitude: data.addressData.lat,
        longitude: data.addressData.lng,
        endereco_completo: `${data.addressData.street}, ${data.addressData.number}, ${data.addressData.neighborhood}`,
      });
      console.log("Objeto final formatado:");
      console.log(JSON.stringify(userData, null, 2));
      console.log("================================");

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        "Cadastro Realizado!",
        "Dados salvos com sucesso! Verifique o console para ver os dados completos.",
        [
          {
            text: "OK",
            onPress: () => router.push("/"),
          },
        ]
      );
    } catch (error) {
      console.error("Erro durante o cadastro:", error);
      Alert.alert("Erro", "Ocorreu um erro durante o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleEditPersonal = () => {
    router.push({
      pathname: "/register-personal",
      params: {
        existingData: JSON.stringify(data.personalData),
      },
    });
  };

  const handleEditAddress = () => {
    router.push({
      pathname: "/register-address",
      params: {
        personalData: JSON.stringify(data.personalData),
        existingData: JSON.stringify(data.addressData),
      },
    });
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
            Revisar Dados
          </TextComponent>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.progressStepCompleted]} />
            <View style={[styles.progressStep, styles.progressStepCompleted]} />
            <View style={[styles.progressStep, styles.progressStepActive]} />
          </View>
          <TextComponent
            type={TextType.textSmallRegular}
            style={styles.progressText}
          >
            Etapa 3 de 3
          </TextComponent>
        </View>

        <View style={styles.content}>
          {/* Dados Pessoais */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TextComponent
                type={TextType.headingMedium}
                style={styles.sectionTitle}
              >
                Dados Pessoais
              </TextComponent>
              <Pressable style={styles.editButton} onPress={handleEditPersonal}>
                <MaterialIcons name="edit" size={16} color={textColor} />
                <TextComponent type={TextType.textSmallSemiBold}>
                  Editar
                </TextComponent>
              </Pressable>
            </View>

            <View style={styles.dataContainer}>
              <View style={styles.dataRow}>
                <TextComponent
                  type={TextType.textSmallMedium}
                  style={styles.label}
                >
                  Nome:
                </TextComponent>
                <TextComponent type={TextType.textSmallRegular}>
                  {data.personalData.name}
                </TextComponent>
              </View>

              <View style={styles.dataRow}>
                <TextComponent
                  type={TextType.textSmallMedium}
                  style={styles.label}
                >
                  Email:
                </TextComponent>
                <TextComponent type={TextType.textSmallRegular}>
                  {data.personalData.email}
                </TextComponent>
              </View>

              <View style={styles.dataRow}>
                <TextComponent
                  type={TextType.textSmallMedium}
                  style={styles.label}
                >
                  Telefone:
                </TextComponent>
                <TextComponent type={TextType.textSmallRegular}>
                  {data.personalData.phone}
                </TextComponent>
              </View>
            </View>
          </View>

          {/* Endereço */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TextComponent
                type={TextType.headingMedium}
                style={styles.sectionTitle}
              >
                Endereço
              </TextComponent>
              <Pressable style={styles.editButton} onPress={handleEditAddress}>
                <MaterialIcons name="edit" size={16} color={textColor} />
                <TextComponent type={TextType.textSmallSemiBold}>
                  Editar
                </TextComponent>
              </Pressable>
            </View>

            <View style={styles.dataContainer}>
              <View style={styles.dataRow}>
                <TextComponent
                  type={TextType.textSmallMedium}
                  style={styles.label}
                >
                  CEP:
                </TextComponent>
                <TextComponent type={TextType.textSmallRegular}>
                  {data.addressData.cep}
                </TextComponent>
              </View>

              <View style={styles.dataRow}>
                <TextComponent
                  type={TextType.textSmallMedium}
                  style={styles.label}
                >
                  Endereço:
                </TextComponent>
                <TextComponent type={TextType.textSmallRegular}>
                  {data.addressData.street}, {data.addressData.number}
                </TextComponent>
              </View>

              <View style={styles.dataRow}>
                <TextComponent
                  type={TextType.textSmallMedium}
                  style={styles.label}
                >
                  Bairro:
                </TextComponent>
                <TextComponent type={TextType.textSmallRegular}>
                  {data.addressData.neighborhood}
                </TextComponent>
              </View>

              {data.addressData.complement && (
                <View style={styles.dataRow}>
                  <TextComponent
                    type={TextType.textSmallMedium}
                    style={styles.label}
                  >
                    Complemento:
                  </TextComponent>
                  <TextComponent type={TextType.textSmallRegular}>
                    {data.addressData.complement}
                  </TextComponent>
                </View>
              )}

              <View style={styles.dataRow}>
                <TextComponent
                  type={TextType.textSmallMedium}
                  style={styles.label}
                >
                  Localização:
                </TextComponent>
                <TextComponent type={TextType.textSmallRegular}>
                  {data.addressData.lat.toFixed(6)},{" "}
                  {data.addressData.lng.toFixed(6)}
                </TextComponent>
              </View>
            </View>
          </View>
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
            style={[styles.registerButton, { backgroundColor: "#10b981" }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="check" size={20} color="#fff" />
                <TextComponent
                  type={TextType.textMediumSemiBold}
                  darkColor="#fff"
                  lightColor="#fff"
                >
                  Cadastrar
                </TextComponent>
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
  content: {
    paddingHorizontal: 16,
    gap: 24,
  },
  section: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    flex: 1,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  dataContainer: {
    gap: 12,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    flex: 1,
    opacity: 0.7,
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
  registerButton: {
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
