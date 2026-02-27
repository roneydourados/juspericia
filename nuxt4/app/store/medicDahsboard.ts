import { defineStore } from 'pinia';

export const useMedicDahsboardStore = defineStore('medicDahsboard', () => {
  const { api } = useAxios();
  const medicDashboard = ref<MedicDashboardProps>();
  const $medicDashboard = computed(() => medicDashboard.value);

  const index = async () => {
    const { data } = await api.get<MedicDashboardProps>("/medic-dashboard");
    medicDashboard.value = data;
  }

  return {
    index,
    $medicDashboard
  };
});