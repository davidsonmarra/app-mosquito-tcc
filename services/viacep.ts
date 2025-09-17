/**
 * Serviço ViaCEP - 100% GRATUITO
 * Usado apenas para buscar endereços por CEP
 */

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface ViaCEPAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export class ViaCEPService {
  private static readonly VIACEP_BASE_URL = "https://viacep.com.br/ws";

  /**
   * Valida formato do CEP
   */
  static validateCEP(cep: string): boolean {
    const cleanCEP = cep.replace(/\D/g, "");
    return cleanCEP.length === 8;
  }

  /**
   * Formata CEP para exibição
   */
  static formatCEP(cep: string): string {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length <= 5) {
      return cleanCEP;
    }
    return cleanCEP.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  /**
   * Busca endereço por CEP (GRATUITO)
   */
  static async getAddressByCEP(cep: string): Promise<ViaCEPAddress | null> {
    try {
      const cleanCEP = cep.replace(/\D/g, "");

      if (!this.validateCEP(cleanCEP)) {
        console.log(`❌ CEP inválido: ${cep}`);
        return null;
      }

      console.log(`🔍 Buscando endereço no ViaCEP (GRATUITO): ${cleanCEP}`);

      const url = `${this.VIACEP_BASE_URL}/${cleanCEP}/json/`;
      const response = await fetch(url);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        console.log(`❌ CEP ${cleanCEP} não encontrado no ViaCEP`);
        return null;
      }

      console.log(`✅ Endereço encontrado no ViaCEP (GRATUITO):`, {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        localidade: data.localidade,
        uf: data.uf,
      });

      return {
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        cep: data.cep,
      };
    } catch (error) {
      console.error("❌ Erro ao buscar endereço no ViaCEP:", error);
      return null;
    }
  }
}
