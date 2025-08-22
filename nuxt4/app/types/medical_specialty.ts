export interface MedicalSpecialtyProps {
  id?: number;
  publicId?: string;
  medicalSpecialty: string;
  status: string;
}

export interface MedicalSpecialtyListResponse {
  medicalSpecialtys: MedicalSpecialtyProps[];
}

export interface MedicalSpecialtySingleResponse {
  medicalSpecialtys: MedicalSpecialtyProps[];
}
