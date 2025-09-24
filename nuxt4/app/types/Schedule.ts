export interface ScheduleProps {
  id?: number;
  medicId?: number;
  patientId?: number;
  patientConsultationId?: number;
  scheduleDate?: string;
  scheduleHour?: string;
  title?: string;
  userSchedule?: string;
  Medic?: UserProps;
  PatientConsultation?: SolicitationConsultationProps;
  publicId?: string;
  status?: string;
  atendimentStart?: string;
  atendimentEnd?: string;
  nuvidioInviteLink?: NuvidioInviteLinkProps;
  nuvidioCallId?: string;
}

export interface HourProps {
  medicId?: number;
  patientConsultationId?: number;
  scheduleDate?: string;
  scheduleHour?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface ScheduleListProps {
  schedules: ScheduleProps[];
  medics: UserProps[];
}
