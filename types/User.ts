export interface Address {
  cep: string;
  street: string;
  number: number;
  neighborhood: string;
  complement?: string;
  city: string;
  lat: number;
  lng: number;
}

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: Address;
}

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

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}
