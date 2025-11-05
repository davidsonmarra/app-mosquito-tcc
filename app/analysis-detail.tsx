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

import AnalysisFeedbackSection from "../components/analysis/AnalysisFeedbackSection";
import AnalysisImageSection from "../components/analysis/AnalysisImageSection";
import AnalysisInfoSection from "../components/analysis/AnalysisInfoSection";
import { useThemeColor } from "../hooks/useThemeColor";
import AuthService from "../services/auth";
import { CampaignService } from "../services/campaign";
import { AnalysisDetail } from "../types/Campaign";

const API_BASE_URL =
  "https://deteccao-criadouro-api-949210563435.southamerica-east1.run.app";

interface ResultApiResponse {
  originalImage: string;
  resultImage: string | null;
  type: string;
  status: string;
  feedback: {
    like: boolean;
    comment: string | null;
  };
  id: number;
  campaignId: number;
  created_at: string;
  processed_at: string | null;
  object_count: number | null;
  userId: number;
}

export default function AnalysisDetailScreen() {
  const { analysisId } = useLocalSearchParams();
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const loadAnalysisDetail = async () => {
    try {
      const headers = await AuthService.getAuthHeaders();
      const resultId = Number(analysisId);

      // Buscar resultado por ID
      const response = await fetch(
        `${API_BASE_URL}/results/getResult/${resultId}`,
        {
          method: "GET",
          headers: {
            ...headers,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta da API:", errorText);
        throw new Error(
          `Erro ao buscar resultado: ${response.status} ${response.statusText}`
        );
      }

      const resultData: ResultApiResponse = await response.json();

      // Buscar título da campanha se tiver campaignId
      let campaignTitle = "Campanha";
      if (resultData.campaignId) {
        try {
          const campaign = await CampaignService.getCampaign(
            resultData.campaignId
          );
          campaignTitle = campaign.title;
        } catch (error) {
          console.error("Erro ao buscar título da campanha:", error);
        }
      }

      // Converter data ISO para timestamp
      const created_at = new Date(resultData.created_at).getTime();

      // Mapear para AnalysisDetail
      const analysisData: AnalysisDetail = {
        id: resultData.id,
        originalImage: resultData.originalImage,
        resultImage: resultData.resultImage || "",
        type: resultData.type as "terreno" | "propriedade",
        feedback: {
          like: resultData.feedback.like,
          comment: resultData.feedback.comment,
        },
        status: resultData.status as
          | "visualized"
          | "finished"
          | "processing"
          | "failed",
        created_at: created_at,
        campaignId: resultData.campaignId,
        campaignTitle: campaignTitle,
        detectedBreedingSites: resultData.object_count || 0,
        location: {
          latitude: 0,
          longitude: 0,
        },
      };

      setAnalysis(analysisData);
    } catch (error) {
      console.error("Erro ao carregar detalhes da análise:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes da análise");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalysisDetail();
  }, [analysisId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalysisDetail();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Carregando detalhes da análise...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!analysis) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#F44336" />
          <Text style={[styles.errorText, { color: textColor }]}>
            Análise não encontrada
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
              Detalhes da Análise
            </Text>
          </View>
        </View>

        {/* Imagens da Análise */}
        <AnalysisImageSection
          originalImage={analysis.originalImage}
          resultImage={analysis.resultImage}
          status={analysis.status}
        />

        {/* Informações da Análise */}
        <AnalysisInfoSection
          analysisId={analysis.id}
          campaignTitle={analysis.campaignTitle}
          detectedBreedingSites={analysis.detectedBreedingSites}
          location={analysis.location}
          createdAt={analysis.created_at}
        />

        {/* Feedback da Análise */}
        <AnalysisFeedbackSection
          feedback={analysis.feedback}
          analysisId={analysis.id}
        />

        {/* Espaço inferior */}
        <View style={styles.bottomSpacer} />
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
  bottomSpacer: {
    height: 32,
  },
});
