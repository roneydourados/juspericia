import { defineStore } from "pinia";

export const useScheduleStore = defineStore("schedule", () => {
  const { api } = useAxios();
  const schedule = ref<ScheduleProps>();
  const schedules = ref<ScheduleProps[]>([]);

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

  const destroy = async (id: number) => {
    await api.delete(`/schedule/${id}`);
  };

  const show = async (id: number) => {
    const { data } = await api.get<ScheduleProps>(`/schedule/${id}`);
    schedule.value = data;
  };

  const index = async (filters: ScheduleProps) => {
    const { medicId, scheduleDate, patientId } = filters;
    const config = {
      params: {
        medicId,
        patientId,
        scheduleDate,
      },
    };
    const { data } = await api.get<ScheduleProps[]>("/schedule", config);
    schedules.value = data;
  };

  return { $all, $single, create, update, destroy, show, index };
});
