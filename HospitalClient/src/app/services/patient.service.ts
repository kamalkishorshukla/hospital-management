import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Patient, PatientDto } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  getPatients(search?: string): Observable<Patient[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Patient[]>(this.apiUrl, { params });
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  createPatient(dto: PatientDto): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, dto);
  }

  updatePatient(id: number, dto: PatientDto): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, dto);
  }

  deletePatient(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
