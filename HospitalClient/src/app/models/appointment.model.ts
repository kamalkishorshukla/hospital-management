import { Doctor } from './doctor.model';
import { Patient } from './patient.model';

export interface Appointment {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
  notes: string;
  createdAt?: string;
}

export interface AppointmentDto {
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  status?: string;
  reason?: string;
  notes?: string;
}
