export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  department: string;
  email: string;
  phone: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string;
  createdAt?: string;
}

export interface DoctorDto {
  name: string;
  specialization: string;
  department: string;
  email: string;
  phone: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string;
}
