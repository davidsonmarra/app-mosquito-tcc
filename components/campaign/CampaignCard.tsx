import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Campaign } from "@/types/Campaign";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface CampaignCardProps {
  campaign: Campaign;
  onPress?: () => void;
}

export default function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  const getStatusColor = () => {
    return campaign.isActive ? "#10b981" : "#ef4444";
  };

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
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TextComponent type={TextType.headingSmall} style={styles.title}>
            {campaign.title}
          </TextComponent>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <MaterialIcons
              name={getStatusIcon()}
              size={12}
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

      <TextComponent
        type={TextType.textMediumRegular}
        style={styles.description}
      >
        {campaign.description}
      </TextComponent>

      <View style={styles.footer}>
        <View style={styles.resultsContainer}>
          <MaterialIcons name="analytics" size={16} color={iconColor} />
          <TextComponent
            type={TextType.textSmallMedium}
            style={styles.resultsText}
          >
            {campaign.resultsNotDisplayed} resultados pendentes
          </TextComponent>
        </View>

        <View style={styles.actionContainer}>
          <MaterialIcons name="arrow-forward" size={20} color={iconColor} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 10,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultsText: {
    fontSize: 12,
  },
  actionContainer: {
    padding: 4,
  },
});
