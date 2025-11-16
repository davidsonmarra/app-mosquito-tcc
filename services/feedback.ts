import AuthService from "./auth";

const API_BASE_URL =
  "https://deteccao-criadouro-api-949210563435.southamerica-east1.run.app";

export interface FeedbackRequest {
  id: number;
  like: boolean;
  comment?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
}

export class FeedbackService {
  /**
   * Envia feedback do usuário para uma análise
   */
  static async submitFeedback(
    resultId: number,
    like: boolean,
    comment?: string
  ): Promise<FeedbackResponse> {
    try {
      const headers = await AuthService.getAuthHeaders();

      const requestBody: FeedbackRequest = {
        id: resultId,
        like: like,
        comment: comment || "", // Sempre enviar comment, mesmo que vazio
      };

      console.log(
        `📤 Enviando feedback para resultado ${resultId}:`,
        requestBody
      );

      const response = await fetch(
        `${API_BASE_URL}/results/updateResultFeedback`,
        {
          method: "PUT",
          headers: {
            ...headers,
            accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Ler resposta como texto primeiro
      const responseText = await response.text();

      if (!response.ok) {
        console.error("Erro na resposta da API:", responseText);
        throw new Error(
          `Erro ao enviar feedback: ${response.status} ${response.statusText}`
        );
      }

      // Tentar parsear JSON se houver conteúdo
      let data = null;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          // Se não for JSON válido, ignorar
          console.log("Resposta não é JSON:", responseText);
        }
      }

      console.log(
        "✅ Feedback enviado com sucesso:",
        data || "Sem resposta JSON"
      );

      return {
        success: true,
        message: "Feedback enviado com sucesso!",
      };
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o feedback. Tente novamente."
      );
    }
  }
}
