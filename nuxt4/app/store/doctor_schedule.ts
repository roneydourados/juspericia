import { defineStore } from "pinia";

export const useDoctorScheduleStore = defineStore("doctor_schedule", () => {
  const { api } = useAxios();

  const doctorSchedules = ref<DoctorScheduleProps[]>([]);
  const $all = computed(() => doctorSchedules.value);

  const index = async (userId: string) => {
    const config = {
      params: {
        userId,
      },
    };
    const { data } = await api.get<DoctorScheduleProps[]>(
      "/doctor-schedules",
      config
    );

    doctorSchedules.value = data;
  };

  const create = async (doctorSchedule: DoctorScheduleProps) => {
    await api.post<DoctorScheduleProps>("/doctor-schedules", doctorSchedule);
  };

  const destroy = async (publicId: string) => {
    await api.delete(`/doctor-schedules/${publicId}`);
  };

  return {
    $all,
    doctorSchedules,
    index,
    create,
    destroy,
  };
});
