import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";

interface CampaignInfoSectionProps {
  title: string;
  items: string[];
}

export default function CampaignInfoSection({
  title,
  items,
}: CampaignInfoSectionProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={[styles.bullet, { color: textColor }]}>•</Text>
            <Text style={[styles.itemText, { color: textColor }]}>{item}</Text>
          </View>
        ))}
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
    marginBottom: 12,
  },
  itemsContainer: {
    gap: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bullet: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  itemText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
