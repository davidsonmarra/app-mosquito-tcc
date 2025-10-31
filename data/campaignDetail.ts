import { CampaignApiResponse, CampaignService } from "../services/campaign";
import { CampaignDetail, CampaignResult } from "../types/Campaign";

export const mockCampaignDetailData: CampaignDetail = {
  id: 1,
  title: "Monitoramento de Focos de Dengue - Região Centro",
  description:
    "Ajude-nos a identificar possíveis focos de dengue na região central da cidade através de fotos de locais com água parada.",
  resultsNotDisplayed: 3,
  isActive: true,
  campaignInfos: [
    "Campanha ativa desde 15 de Janeiro de 2024",
    "Área de cobertura: Região Centro (5km²)",
    "Meta: Identificar 100 focos potenciais",
    "Prazo: 30 de Março de 2024",
    "Recompensa: R$ 5,00 por foto validada",
  ],
  instructionInfos: [
    "Tire fotos de locais com água parada",
    "Inclua pneus, garrafas, vasos de plantas",
    "Evite fotos de pessoas ou propriedades privadas",
    "Use boa iluminação e foco nítido",
    "Registre a localização exata quando possível",
  ],
  results: [
    {
      id: 1,
      originalImage:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop&crop=center",
      resultImage:
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop&crop=center",
      type: "terreno",
      feedback: {
        like: true,
        comment: "Excelente identificação! Foco confirmado.",
      },
      status: "visualized",
      created_at: 1704067200000, // 1 Jan 2024
    },
    {
      id: 2,
      originalImage:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop&crop=center",
      resultImage:
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop&crop=center",
      type: "propriedade",
      feedback: {
        like: null, // Usuário ainda não avaliou
        comment: null, // Usuário ainda não comentou
      },
      status: "finished",
      created_at: 1704153600000, // 2 Jan 2024
    },
    {
      id: 3,
      originalImage:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop&crop=center",
      resultImage: "",
      type: "terreno",
      feedback: {
        like: false, // Usuário avaliou negativamente
        comment: null, // Usuário ainda não comentou
      },
      status: "processing",
      created_at: 1704240000000, // 3 Jan 2024
    },
    {
      id: 4,
      originalImage:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop&crop=center",
      resultImage: "",
      type: "propriedade",
      feedback: {
        like: false,
        comment: null, // Usuário ainda não comentou
      },
      status: "failed",
      created_at: 1704326400000, // 4 Jan 2024
    },
  ],
};

/**
 * Mapeia a resposta da API para o formato CampaignDetail esperado pela UI
 */
function mapApiCampaignDetailToCampaignDetail(
  apiCampaign: CampaignApiResponse
): CampaignDetail {
  // Determinar se a campanha está ativa baseado na data de término
  const finishDate = new Date(apiCampaign.finish_at);
  const now = new Date();
  const isActive = finishDate > now;

  // Contar resultados não visualizados (não "visualized")
  const resultsNotDisplayed = apiCampaign.results.filter(
    (result: any) => result.status !== "visualized"
  ).length;

  // Mapear resultados da API para CampaignResult[]
  const mappedResults: CampaignResult[] = (apiCampaign.results || []).map(
    (result: any) => {
      // Converter created_at de string ISO para timestamp em milissegundos
      const created_at =
        result.created_at instanceof Date
          ? result.created_at.getTime()
          : typeof result.created_at === "string"
          ? new Date(result.created_at).getTime()
          : typeof result.created_at === "number"
          ? result.created_at
          : Date.now();

      return {
        id: result.id,
        originalImage: result.original_image || result.originalImage || "",
        resultImage: result.result_image || result.resultImage || "",
        type: result.type || "terreno",
        feedback: {
          like: result.feedback?.like ?? null,
          comment: result.feedback?.comment ?? null,
        },
        status: result.status || "processing",
        created_at,
      };
    }
  );

  return {
    id: apiCampaign.id,
    title: apiCampaign.title,
    description: apiCampaign.description,
    isActive,
    resultsNotDisplayed,
    campaignInfos: apiCampaign.campaign_infos || [],
    instructionInfos: apiCampaign.instruction_infos || [],
    results: mappedResults,
  };
}

export const fetchCampaignDetail = async (
  campaignId: number
): Promise<CampaignDetail> => {
  try {
    // Buscar dados da API
    const apiCampaign = await CampaignService.getCampaign(campaignId);

    // Mapear para o formato esperado
    return mapApiCampaignDetailToCampaignDetail(apiCampaign);
  } catch (error) {
    console.error("Erro ao buscar detalhes da campanha:", error);
    throw error;
  }
};
