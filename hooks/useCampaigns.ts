import { fetchCampaigns } from "@/data/campaigns";
import { CampaignsResponse } from "@/types/Campaign";
import { useCallback, useEffect, useState } from "react";

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

      // Usar a função de fetch dos dados
      const response = await fetchCampaigns();
      setCampaigns(response.campaigns);
    } catch (err) {
      setError("Erro ao carregar campanhas");
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
