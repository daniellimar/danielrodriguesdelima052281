import {Pet} from './pet.model';

export interface Foto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto?: Foto;
  pets?: Pet[];
}

export interface CreateTutorDto {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
}

export interface TutorListResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Tutor[];
}
