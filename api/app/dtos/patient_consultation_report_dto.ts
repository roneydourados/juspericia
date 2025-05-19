import { FileProps } from './file_dto.js'
import { SolicitationConsultationProps } from './solicitation_consultation_dto.js'
import { UserProps } from './user_dto.js'

export interface PatientConsultationReportProps {
  id?: number
  userId?: number
  patientConsultationId?: number
  content?: string
  publicId?: string
  status?: string
  deletedAt?: string
  userDeleted?: string
  reportDate?: string
  Medic?: UserProps
  PatientConsultation?: SolicitationConsultationProps
  attachments?: FileProps[]
}
