import { defineStore } from "pinia";

export const usePasswordVaultStore = defineStore("passwordVault", () => {
  const { api } = useAxios();

  const passwordVaults = ref<PasswordVaultProps[]>([]);

  const $all = computed(() => passwordVaults.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        query: inputQuery,
      },
    };

    const { data } = await api.get<PasswordVaultProps[]>(
      "/password-vault",
      config
    );

    passwordVaults.value = data;
  };

  const store = async (payload: PasswordVaultProps) => {
    await api.post("/password-vault", payload);
  };

  const updated = async (payload: PasswordVaultProps) => {
    await api.put(`/password-vault/${payload.publicId}`, payload);
  };

  return {
    $all,
    index,
    store,
    updated,
  };
});
