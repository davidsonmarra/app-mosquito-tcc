import { CampaignDetail } from "../types/Campaign";

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

export const fetchCampaignDetail = async (
  campaignId: number
): Promise<CampaignDetail> => {
  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Por enquanto, retornar sempre os mesmos dados mockados
  // Em produção, faria uma chamada real para a API
  return mockCampaignDetailData;
};
