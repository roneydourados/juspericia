export interface ScheduleProps {
  id?: number;
  medicId?: number;
  patientConsultationId?: number;
  scheduleDate?: string;
  scheduleHour?: string;
  title?: string;
  userSchedule?: string;
  Medic?: UserProps;
  PatientConsultation?: SolicitationConsultationProps;
}