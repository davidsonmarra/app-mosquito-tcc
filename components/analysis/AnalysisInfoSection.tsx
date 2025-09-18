import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";

interface AnalysisInfoSectionProps {
  analysisId: number;
  campaignTitle: string;
  detectedBreedingSites: number;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: number;
}

export default function AnalysisInfoSection({
  analysisId,
  campaignTitle,
  detectedBreedingSites,
  location,
  createdAt,
}: AnalysisInfoSectionProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(createdAt);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        📊 Informações da Análise
      </Text>

      <View style={styles.infoGrid}>
        {/* ID da Análise */}
        <View style={styles.infoItem}>
          <MaterialIcons name="fingerprint" size={20} color={tintColor} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: textColor }]}>
              ID da Análise
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              #{analysisId}
            </Text>
          </View>
        </View>

        {/* Data/Horário */}
        <View style={styles.infoItem}>
          <MaterialIcons name="schedule" size={20} color={tintColor} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: textColor }]}>
              Data/Horário
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {date} às {time}
            </Text>
          </View>
        </View>

        {/* Criadouros Detectados */}
        <View style={styles.infoItem}>
          <MaterialIcons name="bug-report" size={20} color={tintColor} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: textColor }]}>
              Criadouros Detectados
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {detectedBreedingSites} foco
              {detectedBreedingSites !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* Localização */}
        <View style={styles.infoItem}>
          <MaterialIcons name="location-on" size={20} color={tintColor} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: textColor }]}>
              Localização
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
          </View>
        </View>

        {/* Campanha */}
        <View style={styles.infoItem}>
          <MaterialIcons name="campaign" size={20} color={tintColor} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: textColor }]}>
              Campanha
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {campaignTitle}
            </Text>
          </View>
        </View>
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
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
});
