import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Pet, PetListResponse} from '../models/pet.model';

export interface CreatePetDto {
  nome: string;
  raca: string;
  especie?: string;
  idade: number;
}

@Injectable({providedIn: 'root'})
export class PetService {
  private readonly apiUrl = `${environment.apiUrl}/v1/pets`;

  constructor(private http: HttpClient) {
  }

  /**
   * Lista pets paginados com filtros opcionais
   * @param page página atual (default 0)
   * @param size tamanho da página (default 10)
   * @param nome filtro por nome do pet (opcional)
   * @param raca filtro por raça do pet (opcional)
   */
  list(
    page: number = 0,
    size: number = 10,
    nome?: string,
    raca?: string
  ): Observable<PetListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nome) {
      params = params.set('nome', nome);
    }

    if (raca) {
      params = params.set('raca', raca);
    }

    return this.http.get<PetListResponse>(this.apiUrl, {params});
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }

  createPet(pet: CreatePetDto): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, pet);
  }

  updatePet(id: number, pet: CreatePetDto): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, pet);
  }

  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadPhoto(petId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post(`${this.apiUrl}/${petId}/fotos`, formData);
  }
}
