import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { UserAnalysis } from "@/types/Analysis";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

interface AnalysisListProps {
  analyses: UserAnalysis[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

const AnalysisList: React.FC<AnalysisListProps> = ({
  analyses,
  loading,
  refreshing,
  onRefresh,
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBackgroundColor = useThemeColor({}, "card");

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "visualized":
        return "#4CAF50";
      case "finished":
        return "#2196F3";
      case "processing":
        return "#FF9800";
      case "failed":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "visualized":
        return "Visualizada";
      case "finished":
        return "Concluída";
      case "processing":
        return "Processando";
      case "failed":
        return "Falhou";
      default:
        return "Desconhecido";
    }
  };

  const getTypeText = (type: string): string => {
    return type === "terreno" ? "Terreno" : "Propriedade";
  };

  const handleAnalysisPress = (analysisId: number) => {
    router.push(`/analysis-detail?analysisId=${analysisId}`);
  };

  const ThumbnailImage = ({ uri }: { uri: string }) => {
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (imageError) {
      return (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <MaterialIcons name="image" size={24} color="#9E9E9E" />
        </View>
      );
    }

    return (
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri }}
          style={styles.thumbnail}
          onLoad={() => setLoading(false)}
          onError={() => {
            setImageError(true);
            setLoading(false);
          }}
        />
        {loading && (
          <View style={styles.thumbnailLoading}>
            <ActivityIndicator size="small" color="#0a7ea4" />
          </View>
        )}
      </View>
    );
  };

  const renderAnalysisItem = ({ item }: { item: UserAnalysis }) => (
    <Pressable
      style={[styles.analysisCard, { backgroundColor: cardBackgroundColor }]}
      onPress={() => handleAnalysisPress(item.id)}
    >
      <View style={styles.cardContent}>
        {/* Thumbnail */}
        <ThumbnailImage uri={item.originalImage} />

        <View style={styles.analysisInfo}>
          {/* Data/Horário */}
          <TextComponent
            type={TextType.textSmallRegular}
            style={[styles.dateText, { color: textColor }]}
          >
            {formatDate(item.created_at)}
          </TextComponent>

          {/* Tipo */}
          <TextComponent
            type={TextType.textMediumSemiBold}
            style={[styles.typeText, { color: textColor }]}
          >
            {getTypeText(item.type)}
          </TextComponent>

          {/* Campanha (se existir) */}
          {item.campaign && (
            <View style={styles.campaignTag}>
              <MaterialIcons name="campaign" size={16} color="#0a7ea4" />
              <TextComponent
                type={TextType.textSmallRegular}
                style={styles.campaignText}
              >
                {item.campaign.title}
              </TextComponent>
            </View>
          )}

          {/* Status */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <TextComponent
              type={TextType.textSmallRegular}
              style={[styles.statusText, { color: textColor }]}
            >
              {getStatusText(item.status)}
            </TextComponent>
          </View>

          {/* Indicador de não visualizado */}
          {item.status === "finished" && (
            <View style={styles.unreadIndicator}>
              <MaterialIcons name="fiber-new" size={16} color="#FF5722" />
              <TextComponent
                type={TextType.textSmallRegular}
                style={styles.unreadText}
              >
                Nova análise
              </TextComponent>
            </View>
          )}
        </View>

        {/* Ícone de navegação */}
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={textColor}
          style={styles.chevronIcon}
        />
      </View>
    </Pressable>
  );

  if (loading && analyses.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <TextComponent
          type={TextType.textMediumRegular}
          style={[styles.loadingText, { color: textColor }]}
        >
          Carregando suas análises...
        </TextComponent>
      </View>
    );
  }

  if (analyses.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor }]}>
        <MaterialIcons name="analytics" size={64} color="#9E9E9E" />
        <TextComponent
          type={TextType.headingMedium}
          style={[styles.emptyTitle, { color: textColor }]}
        >
          Nenhuma análise encontrada
        </TextComponent>
        <TextComponent
          type={TextType.textMediumRegular}
          style={[styles.emptyDescription, { color: textColor }]}
        >
          Suas análises aparecerão aqui quando você tirar fotos
        </TextComponent>
      </View>
    );
  }

  return (
    <FlatList
      data={analyses}
      renderItem={renderAnalysisItem}
      keyExtractor={(item) => item.id.toString()}
      style={[styles.list, { backgroundColor }]}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: "center",
    opacity: 0.7,
  },
  analysisCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  thumbnailPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  thumbnailLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
  },
  analysisInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dateText: {
    opacity: 0.7,
    marginBottom: 4,
  },
  typeText: {
    marginBottom: 6,
  },
  campaignTag: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  campaignText: {
    marginLeft: 4,
    color: "#0a7ea4",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
  },
  unreadIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  unreadText: {
    marginLeft: 4,
    color: "#FF5722",
    fontSize: 12,
  },
  chevronIcon: {
    opacity: 0.5,
  },
});

export default AnalysisList;
