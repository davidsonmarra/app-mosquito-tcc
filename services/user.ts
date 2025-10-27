import { User } from "@/types/User";
import AuthService from "./auth";

const API_BASE_URL =
  "https://deteccao-criadouro-api-949210563435.southamerica-east1.run.app";

export interface LoginResponse {
  message: string;
  profile: {
    id: number;
    email: string;
    name: string;
  };
  // Campo opcional token se vir separado
  token?: string;
}

export class UserService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.log("Erro da API (texto):", responseText);

        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.log("Erro da API (JSON):", errorData);
        } catch {
          errorData = {
            message: responseText || "Erro desconhecido do servidor",
          };
        }

        const errorMessage =
          errorData.detail?.message ||
          errorData.message ||
          `Erro ao fazer login: ${response.status} ${response.statusText}`;

        throw new Error(errorMessage);
      }

      const data: LoginResponse = await response.json();

      // Validar se a resposta está correta
      if (!data.profile) {
        throw new Error("Dados do perfil não recebidos da API");
      }

      // Se não tem token, criar um mock baseado no ID (isso será ajustado quando o backend retornar token)
      const mockToken = `token_${data.profile.id}_${Date.now()}`;

      // Salvar token e dados do usuário
      await AuthService.saveToken(mockToken);
      await AuthService.saveUser({
        id: data.profile.id.toString(),
        email: data.profile.email,
        name: data.profile.name,
      });

      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  static async registerUser(
    userData: User
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Validações básicas
      if (!userData.name || userData.name.length < 2) {
        throw new Error("Nome deve ter pelo menos 2 caracteres");
      }

      if (!userData.email || !this.isValidEmail(userData.email)) {
        throw new Error("Email inválido");
      }

      if (!userData.password || userData.password.length < 6) {
        throw new Error("Senha deve ter pelo menos 6 caracteres");
      }

      if (!userData.phone || userData.phone.length < 10) {
        throw new Error("Telefone inválido");
      }

      if (!userData.address.cep || userData.address.cep.length !== 8) {
        throw new Error("CEP inválido");
      }

      if (!userData.address.city) {
        throw new Error("Cidade é obrigatória");
      }

      // Preparar dados para a API
      const apiData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        address: {
          cep: userData.address.cep,
          street: userData.address.street,
          number: userData.address.number,
          neighborhood: userData.address.neighborhood,
          complement: userData.address.complement || "",
          city: userData.address.city,
          lat: userData.address.lat.toString(),
          lng: userData.address.lng.toString(),
        },
      };

      console.log("Enviando cadastro para API:", {
        ...apiData,
        password: "***", // Não logar a senha
      });

      const response = await fetch(`${API_BASE_URL}/user/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Erro ao cadastrar usuário: ${response.status} ${response.statusText}`
        );
      }

      return {
        success: true,
        message: "Usuário cadastrado com sucesso!",
      };
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Erro ao cadastrar usuário",
      };
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static formatPhone(phone: string): string {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, "");

    // Aplica máscara: (00) 00000-0000
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  static validatePhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length === 11;
  }
}
