import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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

import { CEPInput, FormInput } from "@/components/form";
import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LocationService } from "@/services/location";
import { UserService } from "@/services/user";
import { ViaCEPAddress } from "@/services/viacep";
import { LocationCoordinates, User } from "@/types/User";

export default function RegisterScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCEPFound = (address: ViaCEPAddress) => {
    setFormData((prev) => ({
      ...prev,
      street: address.street,
      neighborhood: address.neighborhood,
    }));
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const hasPermission = await LocationService.requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          "Permissão Necessária",
          "É necessário permitir acesso à localização para completar o cadastro."
        );
        return;
      }

      const location = await LocationService.getCurrentLocation();
      // const location = null; // Temporário para evitar erro
      if (location) {
        Alert.alert(
          "Localização Capturada",
          `Lat: ${location.latitude.toFixed(
            6
          )}\nLng: ${location.longitude.toFixed(6)}`
        );
      } else {
        Alert.alert("Erro", "Não foi possível obter a localização atual.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao obter localização.");
    } finally {
      setLocationLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    if (!formData.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simular captura de localização (em produção seria real)
      const mockLocation: LocationCoordinates = {
        latitude: -19.9167,
        longitude: -43.9345,
      };

      const userData: User = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.replace(/\D/g, ""),
        address: {
          cep: formData.cep.replace(/\D/g, ""),
          street: formData.street.trim(),
          number: parseInt(formData.number),
          neighborhood: formData.neighborhood.trim(),
          complement: formData.complement.trim() || undefined,
          lat: mockLocation.latitude,
          lng: mockLocation.longitude,
        },
      };

      const result = await UserService.registerUser(userData);

      if (result.success) {
        Alert.alert("Sucesso", result.message, [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Erro", result.message);
      }
    } catch (error) {
      Alert.alert("Erro", "Erro inesperado ao cadastrar usuário.");
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
            Cadastro
          </TextComponent>
        </View>

        <View style={styles.form}>
          <TextComponent
            type={TextType.headingMedium}
            style={styles.sectionTitle}
          >
            Dados Pessoais
          </TextComponent>

          <FormInput
            label="Nome Completo"
            value={formData.name}
            onChangeText={(text) => updateFormData("name", text)}
            placeholder="Digite seu nome completo"
            error={errors.name}
          />

          <FormInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateFormData("email", text)}
            placeholder="seu@email.com"
            keyboardType="email-address"
            error={errors.email}
          />

          <FormInput
            label="Senha"
            value={formData.password}
            onChangeText={(text) => updateFormData("password", text)}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            error={errors.password}
          />

          <FormInput
            label="Confirmar Senha"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData("confirmPassword", text)}
            placeholder="Digite a senha novamente"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <FormInput
            label="Telefone"
            value={formData.phone}
            onChangeText={(text) => updateFormData("phone", text)}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            error={errors.phone}
          />

          <TextComponent
            type={TextType.headingMedium}
            style={styles.sectionTitle}
          >
            Endereço
          </TextComponent>

          <CEPInput
            value={formData.cep}
            onChangeText={(text) => updateFormData("cep", text)}
            onAddressFound={handleCEPFound}
            error={errors.cep}
          />

          <FormInput
            label="Rua"
            value={formData.street}
            onChangeText={(text) => updateFormData("street", text)}
            placeholder="Nome da rua"
            error={errors.street}
          />

          <FormInput
            label="Número"
            value={formData.number}
            onChangeText={(text) => updateFormData("number", text)}
            placeholder="123"
            keyboardType="numeric"
            error={errors.number}
          />

          <FormInput
            label="Bairro"
            value={formData.neighborhood}
            onChangeText={(text) => updateFormData("neighborhood", text)}
            placeholder="Nome do bairro"
            error={errors.neighborhood}
          />

          <FormInput
            label="Complemento"
            value={formData.complement}
            onChangeText={(text) => updateFormData("complement", text)}
            placeholder="Apartamento, casa, etc. (opcional)"
          />

          <View style={styles.locationSection}>
            <TextComponent
              type={TextType.textMediumSemiBold}
              style={styles.locationLabel}
            >
              Localização Atual
            </TextComponent>
            <Pressable
              style={[
                styles.locationButton,
                { backgroundColor: textColor + "20" },
              ]}
              onPress={getCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color={textColor} />
              ) : (
                <MaterialIcons name="my-location" size={20} color={textColor} />
              )}
              <TextComponent type={TextType.textMediumSemiBold}>
                Capturar Localização
              </TextComponent>
            </Pressable>
          </View>

          <Pressable
            style={[styles.submitButton, { backgroundColor: textColor }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <TextComponent
                type={TextType.textMediumSemiBold}
                darkColor="#fff"
                lightColor="#fff"
              >
                Cadastrar
              </TextComponent>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  locationSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  locationLabel: {
    marginBottom: 12,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
});
