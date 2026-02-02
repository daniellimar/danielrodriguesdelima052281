import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Tutor, TutorListResponse, CreateTutorDto} from '../models/tutor.model';
import {Pet} from '../models/pet.model';

@Injectable({providedIn: 'root'})
export class TutorService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/tutores`;

  getTutores(page = 0, nome = ''): Observable<TutorListResponse> {
    let params = new HttpParams().set('page', page.toString()).set('size', '10');
    if (nome) params = params.set('nome', nome);
    return this.http.get<TutorListResponse>(this.apiUrl, {params});
  }

  getTutorById(id: number): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.apiUrl}/${id}`);
  }

  createTutor(tutor: CreateTutorDto): Observable<Tutor> {
    return this.http.post<Tutor>(this.apiUrl, tutor);
  }

  updateTutor(id: number, tutor: CreateTutorDto): Observable<Tutor> {
    return this.http.put<Tutor>(`${this.apiUrl}/${id}`, tutor);
  }

  deleteTutor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadPhoto(tutorId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post(`${this.apiUrl}/${tutorId}/fotos`, formData);
  }

  // --- VINCULAÇÃO PET-TUTOR ---
  linkPet(tutorId: number, petId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${tutorId}/pets/${petId}`,
      {}
    );
  }

  unlinkPet(tutorId: number, petId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${tutorId}/pets/${petId}`
    );
  }
}
