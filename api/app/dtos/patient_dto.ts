import {
  AddressProps,
  BenefitTypeProps,
  ReportPurposeProps,
  SolicitationConsultationProps,
  UserProps,
} from './index.js'

export interface PatientProps {
  id?: number
  userId?: number
  name?: string
  surname?: string
  email?: string
  motherName?: string
  phone?: string
  cpf?: string
  rg?: string
  status?: string
  birthDate?: string
  sexy?: string
  publicId?: string
  proccessNumber?: string
  benefitTypeId?: number
  reportPurposeId?: number
  ReportPurpose?: ReportPurposeProps
  BenefitType?: BenefitTypeProps
  User?: UserProps
  PatientConsultation?: SolicitationConsultationProps[]
  PatientAddress?: AddressProps
}
