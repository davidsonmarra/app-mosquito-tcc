import { CampaignList } from "@/components/campaign";
import TextComponent, { TextType } from "@/components/text";
import { FloatingActionButton } from "@/components/ui";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { campaigns, loading, error, refreshCampaigns } = useCampaigns();

  const handleLogout = () => {
    router.back();
  };

  const handleTakePhoto = () => {
    router.push("/camera");
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
      <View style={styles.header}>
        <TextComponent type={TextType.headingLarge} style={styles.title}>
          Detector de Focos da Dengue
        </TextComponent>

        <Pressable style={[styles.logoutButton]} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <TextComponent
            type={TextType.textMediumSemiBold}
            darkColor="#fff"
            lightColor="#fff"
          >
            Sair
          </TextComponent>
        </Pressable>
      </View>

      <CampaignList
        campaigns={campaigns}
        onRefresh={refreshCampaigns}
        refreshing={loading}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 8,
  },
  title: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
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
});
