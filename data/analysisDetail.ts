import { AnalysisDetail } from "../types/Campaign";

export const mockAnalysisDetailData: AnalysisDetail = {
  id: 1,
  originalImage:
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center",
  resultImage:
    "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&crop=center",
  type: "terreno",
  feedback: {
    like: null, // Usuário ainda não avaliou
    comment: null, // Usuário ainda não comentou
  },
  status: "visualized",
  created_at: 1704067200000, // 1 Jan 2024
  campaignId: 1,
  campaignTitle: "Monitoramento de Focos de Dengue - Região Centro",
  detectedBreedingSites: 3,
  location: {
    latitude: -19.9167,
    longitude: -43.9345,
  },
};

export const fetchAnalysisDetail = async (
  analysisId: number
): Promise<AnalysisDetail> => {
  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Por enquanto, retornar sempre os mesmos dados mockados
  // Em produção, faria uma chamada real para a API
  return mockAnalysisDetailData;
};
