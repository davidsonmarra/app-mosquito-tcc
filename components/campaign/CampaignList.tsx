import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Campaign } from "@/types/Campaign";
import { router } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import CampaignCard from "./CampaignCard";
import FeaturedCampaignCard from "./FeaturedCampaignCard";

interface CampaignListProps {
  campaigns: Campaign[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function CampaignList({
  campaigns,
  onRefresh,
  refreshing = false,
}: CampaignListProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const handleCampaignPress = (campaign: Campaign) => {
    // Navegar para a tela de detalhes da campanha
    router.push({
      pathname: "/campaign-detail" as any,
      params: { campaignId: campaign.id.toString() },
    });
  };

  // Separar primeira campanha das demais
  const featuredCampaign = campaigns[0];
  const otherCampaigns = campaigns.slice(1);

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <CampaignCard campaign={item} onPress={() => handleCampaignPress(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <TextComponent type={TextType.headingMedium} style={styles.emptyTitle}>
        Nenhuma campanha encontrada
      </TextComponent>
      <TextComponent
        type={TextType.textMediumRegular}
        style={styles.emptyDescription}
      >
        Não há campanhas disponíveis no momento. Tente novamente mais tarde.
      </TextComponent>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {featuredCampaign && (
        <FeaturedCampaignCard
          campaign={featuredCampaign}
          onPress={() => handleCampaignPress(featuredCampaign)}
        />
      )}

      {otherCampaigns.length > 0 && (
        <View style={styles.sectionHeader}>
          <TextComponent
            type={TextType.headingSmall}
            style={styles.sectionTitle}
          >
            Outras Campanhas
          </TextComponent>
          <TextComponent
            type={TextType.textMediumRegular}
            style={styles.subtitle}
          >
            {otherCampaigns.length} campanha
            {otherCampaigns.length !== 1 ? "s" : ""} disponível
            {otherCampaigns.length !== 1 ? "eis" : ""}
          </TextComponent>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={otherCampaigns}
        renderItem={renderCampaign}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={textColor}
            />
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 8,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
});
