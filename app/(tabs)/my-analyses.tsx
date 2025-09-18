import { AnalysisList } from "@/components/analysis";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUserAnalyses } from "@/hooks/useUserAnalyses";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyAnalysesScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { analyses, loading, refreshing, error, refreshAnalyses } =
    useUserAnalyses();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
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
});
