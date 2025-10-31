import AuthService from "./auth";

const API_BASE_URL =
  "https://deteccao-criadouro-api-949210563435.southamerica-east1.run.app";

export interface CampaignApiResponse {
  id: number;
  title: string;
  description: string;
  city: string;
  campaign_infos: string[];
  instruction_infos: string[];
  created_at: string;
  finish_at: string;
  results: any[];
}

export interface CampaignsApiResponse {
  campaigns: CampaignApiResponse[];
}

export class CampaignService {
  /**
   * Busca campanhas por ID do usuário
   */
  static async getCampaignsByUser(
    userId: number
  ): Promise<CampaignsApiResponse> {
    try {
      const headers = await AuthService.getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/campaigns/getCampaignByUser/${userId}`,
        {
          method: "GET",
          headers: {
            ...headers,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta da API:", errorText);
        throw new Error(
          `Erro ao buscar campanhas: ${response.status} ${response.statusText}`
        );
      }

      const data: CampaignsApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
      throw error;
    }
  }

  /**
   * Busca detalhes de uma campanha específica por ID
   */
  static async getCampaign(campaignId: number): Promise<CampaignApiResponse> {
    try {
      const headers = await AuthService.getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/campaigns/getCampaign/${campaignId}`,
        {
          method: "GET",
          headers: {
            ...headers,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta da API:", errorText);
        throw new Error(
          `Erro ao buscar detalhes da campanha: ${response.status} ${response.statusText}`
        );
      }

      const data: CampaignApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar detalhes da campanha:", error);
      throw error;
    }
  }
}
