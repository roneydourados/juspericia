export interface MedicalSpecialtyProps {
  id?: number;
  publicId?: string;
  medicalSpecialty: string;
  status: string;
  value: number;
}

export interface MedicalSpecialtyListResponse {
  medicalSpecialtys: MedicalSpecialtyProps[];
}

export interface MedicalSpecialtySingleResponse {
  medicalSpecialtys: MedicalSpecialtyProps[];
}

export interface MedicalSpecialtyMedicProps {
  medicalSpecialtyId: number;
  medicId: number;
  medicalSpecialty: MedicalSpecialtyProps;
}

export interface MedicalSpecialtyAssociationsProps {
  medicalSpecialtyAssociations: MedicalSpecialtyMedicProps[];
}
