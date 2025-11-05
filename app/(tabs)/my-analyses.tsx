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

  // Atualizar quando a tela voltar ao foco (ex: após enviar foto ou voltar de outra tela)
  useFocusEffect(
    useCallback(() => {
      // Recarregar dados quando a tela voltar ao foco
      // Usar refreshing ao invés de loading para não mostrar tela de loading
      if (analyses.length > 0 || !loading) {
        refreshAnalyses();
      }
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
