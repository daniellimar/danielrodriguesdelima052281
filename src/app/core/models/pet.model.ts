import {Tutor} from './tutor.model';

export interface Foto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  especie?: string;
  idade: number;
  tutorId?: number;
  foto?: Foto;
  tutores?: Tutor[];
}

export interface PetListResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Pet[];
}
