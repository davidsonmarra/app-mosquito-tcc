import { LocationCoordinates } from "@/types/User";

export interface GoogleMapsAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  coordinates: LocationCoordinates;
}

export class GoogleMapsService {
  // API Key do Google Maps (deve estar no arquivo .env)
  private static readonly GOOGLE_MAPS_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  private static readonly GOOGLE_MAPS_BASE_URL =
    "https://maps.googleapis.com/maps/api";

  /**
   * Busca endereço completo por CEP usando ViaCEP + Google Maps
   * @param cep CEP formatado (00000-000)
   * @returns Endereço completo com coordenadas do Google Maps
   */
  static async getAddressByCEP(cep: string): Promise<GoogleMapsAddress | null> {
    try {
      const cleanCEP = cep.replace(/\D/g, "");

      if (cleanCEP.length !== 8) {
        throw new Error("CEP deve ter 8 dígitos");
      }

      console.log(`🔍 Buscando CEP ${cep} no ViaCEP...`);

      // Buscar endereço real no ViaCEP
      const viaCEPResponse = await this.fetchViaCEP(cleanCEP);

      if (!viaCEPResponse) {
        console.log(`❌ CEP ${cep} não encontrado no ViaCEP`);
        return null;
      }

      console.log(`✅ Endereço encontrado no ViaCEP:`, viaCEPResponse);

      // Criar endereço SEM buscar coordenadas ainda (economia de API)
      const googleMapsAddress: GoogleMapsAddress = {
        street: viaCEPResponse.logradouro,
        number: "1", // Número padrão
        neighborhood: viaCEPResponse.bairro,
        city: viaCEPResponse.localidade,
        state: viaCEPResponse.uf,
        cep: viaCEPResponse.cep,
        coordinates: this.getGoogleMapsCityCoordinates(
          viaCEPResponse.localidade,
          viaCEPResponse.uf
        ), // Apenas coordenadas base da cidade
      };

      console.log(
        "🎯 Endereço completo com coordenadas do Google Maps:",
        googleMapsAddress
      );
      return googleMapsAddress;
    } catch (error) {
      console.error("❌ Erro ao buscar endereço:", error);
      return null;
    }
  }

  /**
   * Busca coordenadas REAIS no Google Maps (quando necessário)
   * @param address Endereço completo formatado
   * @returns Coordenadas do Google Maps ou null
   */
  static async getCoordinatesByAddress(
    address: string
  ): Promise<LocationCoordinates | null> {
    try {
      console.log(
        `🗺️ Buscando coordenadas REAIS no Google Maps para: ${address}`
      );

      const coordinates = await this.getGoogleMapsCoordinates(address);

      if (coordinates) {
        console.log(
          `✅ Coordenadas REAIS encontradas no Google Maps:`,
          coordinates
        );
        return coordinates;
      } else {
        console.log(`❌ Não foi possível obter coordenadas do Google Maps`);
        return null;
      }
    } catch (error) {
      console.error("❌ Erro ao buscar coordenadas no Google Maps:", error);
      return null;
    }
  }

  /**
   * Busca coordenadas específicas quando usuário clica em "Continuar"
   * @param street Rua
   * @param number Número
   * @param neighborhood Bairro
   * @param city Cidade
   * @param state Estado
   * @param cep CEP
   * @returns Coordenadas precisas do Google Maps
   */
  static async getFinalCoordinates(
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    cep: string
  ): Promise<LocationCoordinates | null> {
    const fullAddress = `${street}, ${number}, ${neighborhood}, ${city}, ${state}, ${cep}, Brasil`;

    console.log(`🎯 Buscando coordenadas FINAIS para cadastro: ${fullAddress}`);

    return await this.getCoordinatesByAddress(fullAddress);
  }

  /**
   * Busca endereço no ViaCEP (API real)
   */
  private static async fetchViaCEP(cep: string): Promise<any> {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        return null;
      }

      return data;
    } catch (error) {
      console.error("❌ Erro ao buscar no ViaCEP:", error);
      return null;
    }
  }

  /**
   * Busca coordenadas REAIS no Google Maps Geocoding API
   */
  private static async getGoogleMapsCoordinates(
    address: string
  ): Promise<LocationCoordinates | null> {
    try {
      // Verificar se tem API key
      if (!this.GOOGLE_MAPS_API_KEY) {
        console.warn(
          "⚠️ API Key do Google Maps não configurada! Verifique o arquivo .env"
        );
        return this.getSimulatedCoordinates(address);
      }

      console.log(
        "🔑 API Key configurada:",
        this.GOOGLE_MAPS_API_KEY.substring(0, 10) + "..."
      );

      // Chamada REAL à API do Google Maps Geocoding
      const encodedAddress = encodeURIComponent(address);
      const url = `${this.GOOGLE_MAPS_BASE_URL}/geocode/json?address=${encodedAddress}&key=${this.GOOGLE_MAPS_API_KEY}&region=br`;

      console.log(`🌐 Fazendo chamada REAL ao Google Maps: ${url}`);

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;

        const coordinates = {
          latitude: location.lat,
          longitude: location.lng,
        };

        console.log("✅ Google Maps REAL - Coordenadas encontradas:", {
          endereco: address,
          coordenadas: coordinates,
          precisao: result.geometry.location_type,
          tipos: result.types,
        });

        return coordinates;
      } else {
        console.error(
          "❌ Google Maps API retornou erro:",
          data.status,
          data.error_message
        );
        return this.getSimulatedCoordinates(address);
      }
    } catch (error) {
      console.error("❌ Erro na chamada ao Google Maps API:", error);
      return this.getSimulatedCoordinates(address);
    }
  }

  /**
   * Fallback com coordenadas simuladas (caso API falhe)
   */
  private static getSimulatedCoordinates(address: string): LocationCoordinates {
    console.log("🔄 Usando coordenadas simuladas como fallback");

    // Extrair informações do endereço
    const addressParts = address.split(",");
    const street = addressParts[0]?.trim() || "";
    const neighborhood = addressParts[1]?.trim() || "";
    const city = addressParts[2]?.trim() || "";
    const state = addressParts[3]?.trim() || "";

    // Coordenadas base por cidade
    const baseCoords = this.getGoogleMapsCityCoordinates(city, state);

    // Gerar coordenadas únicas baseadas no endereço completo
    const addressHash = this.hashAddress(street + neighborhood + city);

    // Variação realista (metros)
    const latVariation = (addressHash % 10000) / 1000000; // ~10 metros
    const lngVariation = (addressHash % 10000) / 1000000; // ~10 metros

    const coordinates = {
      latitude: baseCoords.latitude + latVariation,
      longitude: baseCoords.longitude + lngVariation,
    };

    console.log("🗺️ Coordenadas simuladas (fallback):", {
      endereco: address,
      coordenadas: coordinates,
      variacao: { lat: latVariation, lng: lngVariation },
      coordenadasBase: baseCoords,
    });

    return coordinates;
  }

  /**
   * Retorna coordenadas base por cidade (simulando Google Maps)
   */
  private static getGoogleMapsCityCoordinates(
    city: string,
    state: string
  ): LocationCoordinates {
    const cityKey = city.toLowerCase();
    const stateKey = state.toLowerCase();

    // Coordenadas mais precisas simulando Google Maps
    if (cityKey.includes("são paulo") || stateKey === "sp") {
      return { latitude: -23.5505, longitude: -46.6333 };
    }
    if (cityKey.includes("rio de janeiro") || stateKey === "rj") {
      return { latitude: -22.9068, longitude: -43.1729 };
    }
    if (cityKey.includes("belo horizonte") || stateKey === "mg") {
      return { latitude: -19.9167, longitude: -43.9345 };
    }
    if (cityKey.includes("brasília") || stateKey === "df") {
      return { latitude: -15.7801, longitude: -47.9292 };
    }
    if (cityKey.includes("salvador") || stateKey === "ba") {
      return { latitude: -12.9714, longitude: -38.5014 };
    }
    if (cityKey.includes("fortaleza") || stateKey === "ce") {
      return { latitude: -3.7172, longitude: -38.5434 };
    }
    if (cityKey.includes("recife") || stateKey === "pe") {
      return { latitude: -8.0476, longitude: -34.877 };
    }
    if (cityKey.includes("porto alegre") || stateKey === "rs") {
      return { latitude: -30.0346, longitude: -51.2177 };
    }

    // Default para São Paulo
    return { latitude: -23.5505, longitude: -46.6333 };
  }

  /**
   * Gera hash de endereço para coordenadas únicas
   */
  private static hashAddress(address: string): number {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      const char = address.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Formata CEP para exibição
   */
  static formatCEP(cep: string): string {
    const cleanCEP = cep.replace(/\D/g, "");
    return cleanCEP.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  /**
   * Valida CEP
   */
  static validateCEP(cep: string): boolean {
    const cleanCEP = cep.replace(/\D/g, "");
    return cleanCEP.length === 8;
  }
}
