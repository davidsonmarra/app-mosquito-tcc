import { fetchUserAnalyses } from "@/services/analysis";
import { UserAnalysis } from "@/types/Analysis";
import AuthService from "@/services/auth";
import { useEffect, useState } from "react";

export const useUserAnalyses = () => {
  const [analyses, setAnalyses] = useState<UserAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalyses = async () => {
    try {
      setError(null);
      
      // Obter userId do usuário autenticado
      const user = await AuthService.getUser();
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }

      const userId = parseInt(user.id, 10);
      if (isNaN(userId)) {
        throw new Error("ID do usuário inválido");
      }

      const data = await fetchUserAnalyses(userId);
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
