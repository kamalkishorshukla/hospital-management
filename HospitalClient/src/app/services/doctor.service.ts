import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doctor, DoctorDto } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) {}

  getDoctors(search?: string): Observable<Doctor[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Doctor[]>(this.apiUrl, { params });
  }

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  createDoctor(dto: DoctorDto): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, dto);
  }

  updateDoctor(id: number, dto: DoctorDto): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, dto);
  }

  deleteDoctor(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
