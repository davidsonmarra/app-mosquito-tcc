import { AnalysisList } from "@/components/analysis";
import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUserAnalyses } from "@/hooks/useUserAnalyses";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyAnalysesScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { analyses, loading, refreshing, error, refreshAnalyses } =
    useUserAnalyses();

  const handleLogout = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Pressable style={[styles.logoutButton]} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <TextComponent
            type={TextType.textMediumSemiBold}
            darkColor="#fff"
            lightColor="#fff"
          >
            Sair
          </TextComponent>
        </Pressable>
      </View>

      <AnalysisList
        analyses={analyses}
        loading={loading}
        refreshing={refreshing}
        onRefresh={refreshAnalyses}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
});
