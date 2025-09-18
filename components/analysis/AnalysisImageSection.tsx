import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";

interface AnalysisImageSectionProps {
  originalImage: string;
  resultImage: string;
  status: string;
}

const { width } = Dimensions.get("window");
const imageWidth = (width - 48) / 2; // 2 imagens com margem

export default function AnalysisImageSection({
  originalImage,
  resultImage,
  status,
}: AnalysisImageSectionProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

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
        return "Visualizada";
      case "finished":
        return "Finalizada";
      case "processing":
        return "Processando";
      case "failed":
        return "Falhou";
      default:
        return "Desconhecido";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        📸 Imagens da Análise
      </Text>

      <View style={styles.imagesContainer}>
        {/* Imagem Original */}
        <View style={styles.imageContainer}>
          <Text style={[styles.imageLabel, { color: textColor }]}>
            Imagem Original
          </Text>
          <Image source={{ uri: originalImage }} style={styles.image} />
        </View>

        {/* Imagem Processada */}
        <View style={styles.imageContainer}>
          <Text style={[styles.imageLabel, { color: textColor }]}>
            Imagem Analisada
          </Text>
          {resultImage ? (
            <Image source={{ uri: resultImage }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={[styles.placeholderText, { color: textColor }]}>
                Processando...
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(status) },
          ]}
        />
        <Text style={[styles.statusText, { color: textColor }]}>
          Status: {getStatusText(status)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  imageContainer: {
    flex: 1,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  image: {
    width: imageWidth,
    height: imageWidth * 0.75, // Aspect ratio 4:3
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  placeholderText: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
