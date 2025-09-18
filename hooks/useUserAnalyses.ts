import { fetchUserAnalysesMock } from "@/services/analysis";
import { UserAnalysis } from "@/types/Analysis";
import { useEffect, useState } from "react";

export const useUserAnalyses = () => {
  const [analyses, setAnalyses] = useState<UserAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalyses = async () => {
    try {
      setError(null);
      const data = await fetchUserAnalysesMock();
      setAnalyses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshAnalyses = () => {
    setRefreshing(true);
    loadAnalyses();
  };

  useEffect(() => {
    loadAnalyses();
  }, []);

  return {
    analyses,
    loading,
    refreshing,
    error,
    refreshAnalyses,
  };
};
