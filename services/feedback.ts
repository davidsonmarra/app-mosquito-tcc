import { AnalysisDetail } from "../types/Campaign";

export interface FeedbackRequest {
  analysisId: number;
  like: boolean;
  comment?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  analysis: AnalysisDetail;
}

export class FeedbackService {
  private static readonly BASE_URL = "https://api.mosquito-camera.com"; // URL do backend real

  /**
   * Envia feedback do usuário para uma análise
   */
  static async submitFeedback(
    analysisId: number,
    like: boolean,
    comment?: string
  ): Promise<FeedbackResponse> {
    try {
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Substituir por chamada real à API
      // const response = await fetch(`${this.BASE_URL}/analyses/${analysisId}/feedback`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify({ like }),
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const data = await response.json();

      // Por enquanto, simular resposta de sucesso
      console.log(`📤 Enviando feedback para análise ${analysisId}:`, {
        like,
        comment,
      });

      const mockResponse: FeedbackResponse = {
        success: true,
        message: "Feedback enviado com sucesso!",
        analysis: {
          id: analysisId,
          originalImage:
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center",
          resultImage:
            "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&crop=center",
          type: "terreno",
          feedback: {
            like: like, // Agora é boolean (já avaliado)
            comment:
              comment ||
              "Excelente identificação! Foco confirmado. Recomendamos intervenção imediata.",
          },
          status: "visualized",
          created_at: 1704067200000,
          campaignId: 1,
          campaignTitle: "Monitoramento de Focos de Dengue - Região Centro",
          detectedBreedingSites: 3,
          location: {
            latitude: -19.9167,
            longitude: -43.9345,
          },
        },
      };

      return mockResponse;
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      throw new Error("Não foi possível enviar o feedback. Tente novamente.");
    }
  }
}
