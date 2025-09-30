import { defineStore } from "pinia";

export const useScheduleStore = defineStore("schedule", () => {
  const { api } = useAxios();
  const schedule = ref<ScheduleProps>();
  const schedules = ref<ScheduleListProps>();

  const $single = computed(() => schedule.value);
  const $all = computed(() => schedules.value);

  const create = async (payload: ScheduleProps) => {
    const { data } = await api.post<ScheduleProps>("/schedule", payload);
    schedule.value = data;
  };

  const update = async (payload: ScheduleProps) => {
    const { data } = await api.put<ScheduleProps>("/schedule", payload);
    schedule.value = data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/schedule/${id}`);
  };

  const show = async (id: string) => {
    const { data } = await api.get<ScheduleProps>(`/schedule/${id}`);
    schedule.value = data;
  };

  const index = async (input: {
    medicId?: number;
    initialDate: string;
    finalDate: string;
    patientId?: number;
    status?: string;
    patientConsultationId?: number;
    medicalSpecialtyId?: number;
  }) => {
    const {
      medicId,
      initialDate,
      finalDate,
      patientId,
      status,
      patientConsultationId,
      medicalSpecialtyId,
    } = input;
    const config = {
      params: {
        medicId,
        patientId,
        initialDate,
        finalDate,
        status,
        patientConsultationId,
        medicalSpecialtyId,
      },
    };
    const { data } = await api.get<ScheduleListProps>("/schedule", config);
    schedules.value = data;
  };

  const indexForMedic = async (input: {
    initialDate: string;
    finalDate: string;
    patientId?: number;
    status?: string;
    patientConsultationId?: number;
  }) => {
    const { initialDate, finalDate, patientId, status, patientConsultationId } =
      input;
    const config = {
      params: {
        patientId,
        initialDate,
        finalDate,
        status,
        patientConsultationId,
      },
    };
    const { data } = await api.get<ScheduleListProps>(
      "/schedule-medic",
      config
    );
    schedules.value = data;
  };

  const clear = () => {
    schedules.value = undefined;
    schedule.value = {};
  };

  const startSchedule = async (consultationId: number, medicId: number) => {
    const payload = {
      consultationId,
      medicId,
    };
    await api.put("/schedule/start", payload);
  };

  const clearMedicSchedule = async (publicId: string) => {
    await api.put(`/schedule/clear-medic/${publicId}`);
  };

  const finalizeSchedule = async (consultationId: number) => {
    await api.put(`/schedule/finalize/${consultationId}`);
  };

  const cancelSchedule = async (publicId: string) => {
    await api.put(`/schedule/cancel/${publicId}`);
  };

  return {
    $all,
    $single,
    create,
    update,
    destroy,
    show,
    index,
    clear,
    indexForMedic,
    startSchedule,
    finalizeSchedule,
    cancelSchedule,
    clearMedicSchedule,
  };
});
