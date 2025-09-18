import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CampaignInfoSection from "../components/campaign/CampaignInfoSection";
import CampaignResultCard from "../components/campaign/CampaignResultCard";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { fetchCampaignDetail } from "../data/campaignDetail";
import { useThemeColor } from "../hooks/useThemeColor";
import { CampaignDetail } from "../types/Campaign";

export default function CampaignDetailScreen() {
  const { campaignId } = useLocalSearchParams();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const loadCampaignDetail = async () => {
    try {
      const campaignData = await fetchCampaignDetail(Number(campaignId));
      setCampaign(campaignData);
    } catch (error) {
      console.error("Erro ao carregar detalhes da campanha:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes da campanha");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCampaignDetail();
  }, [campaignId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCampaignDetail();
  };

  const handleTakePhoto = () => {
    // TODO: Implementar navegação para câmera
    Alert.alert(
      "Câmera",
      "Funcionalidade de câmera será implementada em breve!"
    );
  };

  const handleResultPress = (resultId: number) => {
    // Navegar para a tela de detalhes da análise
    router.push({
      pathname: "/analysis-detail" as any,
      params: { analysisId: resultId.toString() },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Carregando detalhes da campanha...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#F44336" />
          <Text style={[styles.errorText, { color: textColor }]}>
            Campanha não encontrada
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const unreadResults = campaign.results.filter(
    (result) => result.status === "visualized" && result.feedback.like === null
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={textColor}
              onPress={() => router.back()}
              style={styles.backButton}
            />
            <Text style={[styles.title, { color: textColor }]}>
              {campaign.title}
            </Text>
          </View>

          <Text style={[styles.description, { color: textColor }]}>
            {campaign.description}
          </Text>

          {unreadResults.length > 0 && (
            <View style={styles.unreadBadge}>
              <MaterialIcons name="fiber-new" size={16} color="white" />
              <Text style={styles.unreadText}>
                {unreadResults.length} não visualizado
                {unreadResults.length > 1 ? "s" : ""}
              </Text>
            </View>
          )}
        </View>

        {/* Informações da Campanha */}
        <CampaignInfoSection
          title="📋 Informações da Campanha"
          items={campaign.campaignInfos}
        />

        {/* Instruções para Registro */}
        <CampaignInfoSection
          title="📸 Instruções para Registro"
          items={campaign.instructionInfos}
        />

        {/* Lista de Resultados */}
        <View style={styles.resultsSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            📊 Análises Enviadas ({campaign.results.length})
          </Text>

          {campaign.results.length === 0 ? (
            <View style={styles.emptyResults}>
              <MaterialIcons name="photo-camera" size={48} color={tintColor} />
              <Text style={[styles.emptyText, { color: textColor }]}>
                Nenhuma análise enviada ainda
              </Text>
              <Text style={[styles.emptySubtext, { color: textColor }]}>
                Tire sua primeira foto para começar!
              </Text>
            </View>
          ) : (
            campaign.results.map((result) => (
              <CampaignResultCard
                key={result.id}
                result={result}
                onPress={() => handleResultPress(result.id)}
              />
            ))
          )}
        </View>

        {/* Espaço para o FAB */}
        <View style={styles.fabSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={handleTakePhoto}
        icon="camera-alt"
        style={styles.fab}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "500",
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 12,
  },
  unreadBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5722",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    gap: 4,
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  resultsSection: {
    marginTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  emptyResults: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    textAlign: "center",
  },
  fabSpacer: {
    height: 100,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
