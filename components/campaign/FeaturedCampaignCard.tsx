import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Campaign } from "@/types/Campaign";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface FeaturedCampaignCardProps {
  campaign: Campaign;
  onPress?: () => void;
}

export default function FeaturedCampaignCard({
  campaign,
  onPress,
}: FeaturedCampaignCardProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  const getStatusText = () => {
    return campaign.isActive ? "Ativa" : "Inativa";
  };

  const getStatusIcon = () => {
    return campaign.isActive ? "check-circle" : "cancel";
  };

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor: campaign.isActive ? "#10b981" : "#ef4444",
        },
      ]}
      onPress={onPress}
    >
      {/* Header com gradiente visual */}
      <View
        style={[
          styles.header,
          { backgroundColor: campaign.isActive ? "#10b981" : "#ef4444" },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <MaterialIcons
              name="star"
              size={20}
              color="#fff"
              style={styles.starIcon}
            />
            <TextComponent
              type={TextType.headingMedium}
              style={styles.featuredTitle}
            >
              DESTAQUE
            </TextComponent>
          </View>
          <View style={styles.statusBadge}>
            <MaterialIcons
              name={getStatusIcon()}
              size={14}
              color="#fff"
              style={styles.statusIcon}
            />
            <TextComponent
              type={TextType.textSmallSemiBold}
              style={styles.statusText}
            >
              {getStatusText()}
            </TextComponent>
          </View>
        </View>
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <TextComponent type={TextType.headingLarge} style={styles.title}>
          {campaign.title}
        </TextComponent>

        <TextComponent
          type={TextType.textMediumRegular}
          style={styles.description}
        >
          {campaign.description}
        </TextComponent>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="analytics" size={18} color={iconColor} />
            <TextComponent
              type={TextType.textMediumSemiBold}
              style={styles.statText}
            >
              {campaign.resultsNotDisplayed} resultados pendentes
            </TextComponent>
          </View>

          <View style={styles.statItem}>
            <MaterialIcons name="location-on" size={18} color={iconColor} />
            <TextComponent
              type={TextType.textMediumSemiBold}
              style={styles.statText}
            >
              Área prioritária
            </TextComponent>
          </View>
        </View>

        {campaign.isActive && (
          <View style={styles.actionContainer}>
            <View style={styles.actionButton}>
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
              <TextComponent
                type={TextType.textMediumSemiBold}
                darkColor="#fff"
                lightColor="#fff"
              >
                Participar Agora
              </TextComponent>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starIcon: {
    marginRight: 4,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusIcon: {
    marginRight: 2,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 12,
    fontSize: 22,
    fontWeight: "700",
  },
  description: {
    marginBottom: 16,
    lineHeight: 22,
    fontSize: 15,
  },
  statsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 14,
  },
  actionContainer: {
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#0a7ea4",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
