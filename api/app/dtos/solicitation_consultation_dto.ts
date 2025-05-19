import {
  BenefitTypeProps,
  ConsultationProps,
  FileProps,
  PatientConsultationReportProps,
  PatientProps,
  ReportPurposeProps,
  SaleProps,
  ScheduleProps,
  UserProps,
} from './index.js'

export interface SolicitationConsultationList {
  consultations: SolicitationConsultationProps[]
  totals: ConsultationListTotals[]
}

interface ConsultationListTotals {
  status: string
  total: number
}
export interface SolicitationConsultationProps {
  id?: number
  patientId?: number
  userId?: number
  medicId?: number
  consultationId?: number
  content?: string
  benefitTypeId?: number
  reportPurposeId?: number
  status?: string
  processSituation?: string
  proccessNumber?: string
  tipValue?: number
  dateOpen?: string
  dateClose?: string
  dateAntecipation?: string
  dateCorrection?: string
  reasonCorrection?: string
  createdAt?: string
  updatedAt?: string
  isSolicitationCorrection?: boolean
  consultationValue?: number
  antecipationValue?: number
  valueCredit?: number
  deadline?: string
  rate?: number
  Medic?: UserProps
  Patient?: PatientProps
  Consultation?: ConsultationProps
  ReportPurpose?: ReportPurposeProps
  BenefitType?: BenefitTypeProps
  Schedule?: ScheduleProps[]
  publicId?: string
  isTelemedicine?: boolean
  PatientConsultationReport?: PatientConsultationReportProps
  Sales?: SaleProps[]
  files?: FileProps[]
}

export interface SolicitationConsultationFilterProps {
  initialDateSolicitation: string
  finalDateSolicitation: string
  status: string
  patientId?: number
  benefitTypeId?: number //tipo de benefício
  reportPurposeId?: number //finalidade do laudo
  userId?: number
  benefitType?: BenefitTypeProps
  patient?: PatientProps
  reportPurpose?: ReportPurposeProps
  lawyer?: UserProps
  publicId?: string
}
