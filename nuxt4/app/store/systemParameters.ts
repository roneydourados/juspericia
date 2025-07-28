import { defineStore } from "pinia";

export const useSystemParametersStore = defineStore("systemParameters", () => {
  const { api } = useAxios();
  const systemParameters = ref<SystemParametersProps>();

  const $parameters = computed(() => systemParameters.value);

  const index = async () => {
    const { data } = await api.get<SystemParametersProps>("system-parameters");

    systemParameters.value = data;
  };

  const update = async (body: SystemParametersProps) => {
    const { data } = await api.put<SystemParametersProps>(
      "system-parameters",
      body
    );

    systemParameters.value = data;
  };

  return {
    $parameters,
    index,
    update,
  };
});
