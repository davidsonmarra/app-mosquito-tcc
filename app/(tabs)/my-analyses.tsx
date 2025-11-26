import { AnalysisList } from "@/components/analysis";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUserAnalyses } from "@/hooks/useUserAnalyses";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyAnalysesScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { analyses, loading, refreshing, error, refreshAnalyses } =
    useUserAnalyses();

  // Atualizar SEMPRE quando a tela entrar em foco
  useFocusEffect(
    useCallback(() => {
      // Sempre recarregar dados quando a tela entrar em foco
      // Usar refreshing ao invés de loading para não mostrar tela de loading completa
      refreshAnalyses();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

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
