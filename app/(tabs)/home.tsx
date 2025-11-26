import { CampaignList } from "@/components/campaign";
import TextComponent, { TextType } from "@/components/text";
import { FloatingActionButton } from "@/components/ui";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { campaigns, loading, error, refreshCampaigns } = useCampaigns();

  const handleTakePhoto = () => {
    router.push("/camera");
  };

  const handleSelectFromGallery = async () => {
    try {
      // Solicitar permissão de acesso à galeria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir o acesso à galeria para selecionar fotos."
        );
        return;
      }

      // Abrir seletor de imagens
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        // Navegar para a tela de câmera com a URI da imagem selecionada
        router.push({
          pathname: "/camera" as any,
          params: {
            photoUri: photoUri,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem da galeria:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={textColor} />
          <TextComponent
            type={TextType.textMediumRegular}
            style={styles.loadingText}
          >
            Carregando campanhas...
          </TextComponent>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <TextComponent
            type={TextType.headingMedium}
            style={styles.errorTitle}
          >
            Erro ao carregar
          </TextComponent>
          <TextComponent
            type={TextType.textMediumRegular}
            style={styles.errorDescription}
          >
            {error}
          </TextComponent>
          <Pressable style={styles.retryButton} onPress={refreshCampaigns}>
            <TextComponent
              type={TextType.textMediumSemiBold}
              darkColor="#fff"
              lightColor="#fff"
            >
              Tentar novamente
            </TextComponent>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <CampaignList
        campaigns={campaigns}
        onRefresh={refreshCampaigns}
        refreshing={loading}
      />

      <FloatingActionButton
        onPress={handleSelectFromGallery}
        icon="photo-library"
        style={styles.uploadFab}
      />
      <FloatingActionButton onPress={handleTakePhoto} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  retryButton: {
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadFab: {
    position: "absolute",
    bottom: 88, // 56px do botão + 12px de gap + 20px da borda
    right: 20,
  },
});
