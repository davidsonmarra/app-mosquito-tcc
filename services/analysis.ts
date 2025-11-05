import { UserAnalysesResponse, UserAnalysis } from "@/types/Analysis";
import AuthService from "./auth";
import { CampaignService } from "./campaign";

const API_BASE_URL =
  "https://deteccao-criadouro-api-949210563435.southamerica-east1.run.app";

interface ResultApiResponse {
  originalImage: string;
  resultImage: string | null;
  type: string;
  status: string;
  feedback: {
    like: boolean;
    comment: string | null;
  };
  id: number;
  campaignId: number | null;
  created_at: string;
  processed_at: string | null;
  object_count: number | null;
  userId: number;
}

export const fetchUserAnalyses = async (userId: number): Promise<UserAnalysis[]> => {
  try {
    const headers = await AuthService.getAuthHeaders();

    const response = await fetch(
      `${API_BASE_URL}/results/getResultByUser/${userId}`,
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
        `Erro ao buscar análises: ${response.status} ${response.statusText}`
      );
    }

    const results: ResultApiResponse[] = await response.json();

    // Mapear resultados e buscar títulos das campanhas quando necessário
    const mappedAnalyses = await Promise.all(
      results.map(async (result) => {
        // Converter data ISO para timestamp
        const created_at = new Date(result.created_at).getTime();

        // Buscar informações da campanha se houver campaignId
        let campaignInfo: UserAnalysis["campaign"] | undefined;
        if (result.campaignId) {
          try {
            const campaign = await CampaignService.getCampaign(result.campaignId);
            campaignInfo = {
              id: campaign.id,
              title: campaign.title,
              description: campaign.description,
            };
          } catch (error) {
            console.error(
              `Erro ao buscar campanha ${result.campaignId}:`,
              error
            );
            // Continua sem a informação da campanha
          }
        }

        const analysis: UserAnalysis = {
          id: result.id,
          originalImage: result.originalImage,
          resultImage: result.resultImage || "",
          type: result.type as "terreno" | "propriedade",
          status: result.status as "visualized" | "finished" | "processing" | "failed",
          created_at: created_at,
          ...(campaignInfo && { campaign: campaignInfo }),
          // Incluir feedback apenas se houver comment ou se like for true/false (avaliado)
          ...(result.feedback.comment || (result.feedback.like !== null && result.feedback.like !== undefined) ? {
            feedback: {
              like: result.feedback.like,
              comment: result.feedback.comment || "",
            },
          } : {}),
        };

        return analysis;
      })
    );

    return mappedAnalyses;
  } catch (error) {
    console.error("Erro ao buscar análises do usuário:", error);
    throw error;
  }
};

// Mock data para desenvolvimento
export const fetchUserAnalysesMock = async (): Promise<UserAnalysis[]> => {
  // Simula delay da API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      id: 1,
      campaign: {
        id: 1,
        title: "Campanha Verão 2024",
        description: "Detecção de focos de dengue no período de verão",
      },
      originalImage: "https://picsum.photos/300/200?random=1",
      resultImage: "https://picsum.photos/300/200?random=2",
      type: "terreno",
      feedback: {
        like: true,
        comment: "Excelente análise!",
      },
      status: "visualized",
      created_at: Date.now() - 86400000, // 1 dia atrás
    },
    {
      id: 2,
      campaign: {
        id: 2,
        title: "Campanha Urbana",
        description: "Focos em áreas urbanas",
      },
      originalImage: "https://picsum.photos/300/200?random=3",
      resultImage: "https://picsum.photos/300/200?random=4",
      type: "propriedade",
      status: "finished",
      created_at: Date.now() - 172800000, // 2 dias atrás
    },
    {
      id: 3,
      originalImage: "https://picsum.photos/300/200?random=5",
      resultImage: "https://picsum.photos/300/200?random=6",
      type: "terreno",
      status: "processing",
      created_at: Date.now() - 3600000, // 1 hora atrás
    },
    {
      id: 4,
      campaign: {
        id: 1,
        title: "Campanha Verão 2024",
        description: "Detecção de focos de dengue no período de verão",
      },
      originalImage: "https://picsum.photos/300/200?random=7",
      resultImage: "https://picsum.photos/300/200?random=8",
      type: "propriedade",
      status: "failed",
      created_at: Date.now() - 259200000, // 3 dias atrás
    },
  ];
};
