export interface DoctorScheduleProps {
  id?: number;
  publicId?: string;
  userId?: number;
  specialtyId?: number;
  dayOfWeek?: number; // 0 a 6
  startTime?: string;
  endTime?: string;
  specialty?: MedicalSpecialtyProps;
  quantity?: number;
  dayOfWeekLabel?: string;
}
