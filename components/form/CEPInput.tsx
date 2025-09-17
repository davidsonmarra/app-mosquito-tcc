import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ViaCEPAddress, ViaCEPService } from "@/services/viacep";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

interface CEPInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onAddressFound: (address: ViaCEPAddress) => void;
  streetNumber?: string;
  error?: string;
}

export default function CEPInput({
  value,
  onChangeText,
  onAddressFound,
  streetNumber,
  error,
}: CEPInputProps) {
  const [loading, setLoading] = useState(false);
  const iconColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "icon");

  const handleSearchCEP = async () => {
    if (!ViaCEPService.validateCEP(value)) {
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 Buscando endereço no ViaCEP (GRATUITO) para CEP:", value);

      // Buscar endereço pelo CEP usando ViaCEP (GRATUITO)
      const address = await ViaCEPService.getAddressByCEP(value);
      if (address) {
        console.log("✅ Endereço encontrado no ViaCEP (GRATUITO):", address);
        onAddressFound(address);
      } else {
        console.log("❌ Endereço não encontrado no ViaCEP");
      }
    } catch (error) {
      console.error("❌ Erro ao buscar endereço no ViaCEP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeText = (text: string) => {
    const formatted = ViaCEPService.formatCEP(text);
    onChangeText(formatted);
  };

  // Função para atualizar coordenadas quando o número for preenchido (REMOVIDA para economizar API)
  // Agora as coordenadas só serão buscadas quando o usuário clicar em "Continuar"

  return (
    <View style={styles.container}>
      <TextComponent type={TextType.textMediumSemiBold} style={styles.label}>
        CEP
      </TextComponent>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor,
              color: textColor,
              borderColor: error ? "#ef4444" : borderColor,
            },
          ]}
          value={value}
          onChangeText={handleChangeText}
          placeholder="00000-000"
          placeholderTextColor={textColor + "80"}
          keyboardType="numeric"
        />
        <Pressable
          style={[styles.searchButton, { backgroundColor: iconColor }]}
          onPress={handleSearchCEP}
          disabled={loading || !ViaCEPService.validateCEP(value)}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="search" size={20} color="#fff" />
          )}
        </Pressable>
      </View>
      {error && (
        <TextComponent type={TextType.textSmallRegular} style={styles.error}>
          {error}
        </TextComponent>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    height: 48,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#ef4444",
    marginTop: 4,
  },
});
