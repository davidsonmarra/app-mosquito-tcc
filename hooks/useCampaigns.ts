import AuthService from "@/services/auth";
import { CampaignApiResponse, CampaignService } from "@/services/campaign";
import { Campaign, CampaignsResponse } from "@/types/Campaign";
import { useCallback, useEffect, useState } from "react";

/**
 * Mapeia Promise de resposta da API para o formato Campaign esperado pela UI
 */
function mapApiCampaignToCampaign(apiCampaign: CampaignApiResponse): Campaign {
  // Determinar se a campanha está ativa baseado na data de término
  const finishDate = new Date(apiCampaign.finish_at);
  const now = new Date();
  const isActive = finishDate > now;

  // Contar resultados não visualizados (não "visualized")
  // Assumindo que resultados não visualizados são aqueles que não têm status "visualized"
  const resultsNotDisplayed = apiCampaign.results.filter(
    (result) => result.status !== "visualized"
  ).length;

  return {
    id: apiCampaign.id,
    title: apiCampaign.title,
    description: apiCampaign.description,
    isActive,
    resultsNotDisplayed,
  };
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignsResponse["campaigns"]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaignsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar ID do usuário autenticado
      const user = await AuthService.getUser();
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }

      const userId = parseInt(user.id, 10);
      if (isNaN(userId)) {
        throw new Error("ID do usuário inválido");
      }

      // Buscar campanhas da API
      const response = await CampaignService.getCampaignsByUser(userId);

      // Mapear campanhas da API para o formato esperado
      const mappedCampaigns = response.campaigns.map(mapApiCampaignToCampaign);
      setCampaigns(mappedCampaigns);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar campanhas";
      setError(errorMessage);
      console.error("Erro ao buscar campanhas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCampaigns = useCallback(async () => {
    await fetchCampaignsData();
  }, [fetchCampaignsData]);

  useEffect(() => {
    fetchCampaignsData();
  }, [fetchCampaignsData]);

  return {
    campaigns,
    loading,
    error,
    refreshCampaigns,
  };
}
