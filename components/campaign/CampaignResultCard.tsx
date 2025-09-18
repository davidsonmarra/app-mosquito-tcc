import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";
import { CampaignResult } from "../../types/Campaign";

interface CampaignResultCardProps {
  result: CampaignResult;
  onPress?: () => void;
}

export default function CampaignResultCard({
  result,
  onPress,
}: CampaignResultCardProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "visualized":
        return "#4CAF50"; // Verde
      case "finished":
        return "#2196F3"; // Azul
      case "processing":
        return "#FF9800"; // Laranja
      case "failed":
        return "#F44336"; // Vermelho
      default:
        return "#9E9E9E"; // Cinza
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "visualized":
        return "Visualizado";
      case "finished":
        return "Finalizado";
      case "processing":
        return "Processando";
      case "failed":
        return "Falhou";
      default:
        return "Desconhecido";
    }
  };

  const getTypeText = (type: string) => {
    return type === "terreno" ? "Terreno" : "Propriedade";
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isUnread =
    result.status === "visualized" && result.feedback.like === null;

  return (
    <Pressable
      style={[
        styles.container,
        { backgroundColor },
        isUnread && styles.unreadContainer,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(result.status) },
            ]}
          />
          <Text style={[styles.statusText, { color: textColor }]}>
            {getStatusText(result.status)}
          </Text>
        </View>
        <Text style={[styles.dateText, { color: textColor }]}>
          {formatDate(result.created_at)}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: result.originalImage }} style={styles.image} />
        {result.resultImage && (
          <Image source={{ uri: result.resultImage }} style={styles.image} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.typeText, { color: tintColor }]}>
          {getTypeText(result.type)}
        </Text>

        {result.feedback.comment && (
          <Text style={[styles.commentText, { color: textColor }]}>
            {result.feedback.comment}
          </Text>
        )}
      </View>

      {isUnread && (
        <View style={styles.unreadIndicator}>
          <MaterialIcons name="fiber-new" size={16} color="#FF5722" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  unreadContainer: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF5722",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
  },
  imageContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  infoContainer: {
    gap: 4,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentText: {
    fontSize: 12,
    opacity: 0.8,
    fontStyle: "italic",
  },
  unreadIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
