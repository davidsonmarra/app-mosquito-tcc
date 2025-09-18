import { UserAnalysesResponse, UserAnalysis } from "@/types/Analysis";

const API_BASE_URL = "https://api.mosquitocamera.com";

export const fetchUserAnalyses = async (): Promise<UserAnalysis[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/analyses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Aqui você adicionaria o token de autenticação
        // "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data: UserAnalysesResponse = await response.json();
    return data.results;
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
