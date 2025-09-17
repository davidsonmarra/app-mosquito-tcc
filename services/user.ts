import { User } from "@/types/User";

export class UserService {
  static async registerUser(
    userData: User
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1500));

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

      // Simular sucesso do cadastro
      console.log("Dados do usuário para cadastro:", {
        name: userData.name,
        email: userData.email,
        password: "***", // Não logar a senha
        phone: userData.phone,
        address: userData.address,
      });

      return {
        success: true,
        message: "Usuário cadastrado com sucesso!",
      };
    } catch (error) {
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
