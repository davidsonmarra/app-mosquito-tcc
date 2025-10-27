import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface AuthToken {
  token: string;
  expiresIn?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

class AuthService {
  private baseUrl =
    "https://deteccao-criadouro-api-949210563435.southamerica-east1.run.app";

  // Buscar token armazenado
  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error("Erro ao buscar token:", error);
      return null;
    }
  }

  // Salvar token
  async saveToken(token: string): Promise<void> {
    try {
      if (!token || token === undefined || token === null) {
        console.error("Token inválido, não será salvo");
        return;
      }
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Erro ao salvar token:", error);
      throw error;
    }
  }

  // Remover token (logout)
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Erro ao remover token:", error);
      throw error;
    }
  }

  // Salvar dados do usuário
  async saveUser(user: AuthUser): Promise<void> {
    try {
      if (!user || user === undefined || user === null) {
        console.error("Usuário inválido, não será salvo");
        return;
      }
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      throw error;
    }
  }

  // Buscar dados do usuário
  async getUser(): Promise<AuthUser | null> {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }
  }

  // Verificar se está autenticado
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  // Obter headers com token
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }
}

export default new AuthService();
