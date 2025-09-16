import { CampaignsResponse } from "@/types/Campaign";

export const campaignsData: CampaignsResponse = {
  campaigns: [
    {
      id: 1,
      title: "Campanha Centro da Cidade",
      description:
        "Identificação de focos de dengue no centro da cidade. Ajude-nos a mapear áreas de risco.",
      resultsNotDisplayed: 0,
      isActive: true,
    },
    {
      id: 2,
      title: "Campanha Zona Norte",
      description:
        "Monitoramento de criadouros na zona norte. Sua contribuição é essencial para nossa saúde.",
      resultsNotDisplayed: 3,
      isActive: false,
    },
    {
      id: 3,
      title: "Campanha Zona Sul",
      description:
        "Detecção de focos na zona sul da cidade. Vamos juntos combater a dengue!",
      resultsNotDisplayed: 0,
      isActive: false,
    },
    {
      id: 4,
      title: "Campanha Parque Municipal",
      description:
        "Análise de criadouros no parque municipal e áreas verdes adjacentes.",
      resultsNotDisplayed: 7,
      isActive: false,
    },
    {
      id: 5,
      title: "Campanha Bairro Residencial",
      description:
        "Monitoramento em bairros residenciais para identificar focos domésticos.",
      resultsNotDisplayed: 2,
      isActive: false,
    },
  ],
};

// Função para simular chamada de API
export const fetchCampaigns = async (): Promise<CampaignsResponse> => {
  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Retornar dados mockados
  return campaignsData;
};
