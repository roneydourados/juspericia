import { defineStore } from "pinia";

export const usePasswordVaultStore = defineStore("passwordVault", () => {
  const { api } = useAxios();

  const passwordVaults = ref<any[]>([]);

  const $all = computed(() => passwordVaults.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        query: inputQuery,
      },
    };

    const { data } = await api.get<any[]>("/password-vault", config);

    passwordVaults.value = data;
  };

  return {
    $all,
    index,
  };
});
