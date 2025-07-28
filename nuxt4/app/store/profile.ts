import { defineStore } from "pinia";

export const useProfileStore = defineStore("profile", () => {
  const { api } = useAxios();
  const profiles = ref<ProfileProps[]>([]);
  const profilesSellers = ref<ProfileProps[]>([]);
  const profile = ref<ProfileProps>();

  const $all = computed(() => profiles.value);
  const $profileSellers = computed(() => profilesSellers.value);
  const $single = computed(() => profile.value);

  const index = async (input: { profileName?: string }) => {
    const { profileName } = input;
    const config = {
      params: {
        profileName,
      },
    };
    const { data } = await api.get<ProfileProps[]>("/profile", config);

    profiles.value = data;
  };

  const indexSellers = async (input: { profileName?: string }) => {
    const { profileName } = input;
    const config = {
      params: {
        profileName,
      },
    };
    const { data } = await api.get<ProfileProps[]>("/profile-sellers", config);

    profilesSellers.value = data;
  };

  const show = async (id: string) => {
    const { data } = await api.get<ProfileProps>(`/profile/${id}`);

    profile.value = data;
  };

  const create = async (input: ProfileProps) => {
    const { data } = await api.post<ProfileProps>("/profile", input);

    profile.value = data;
  };

  const update = async (input: ProfileProps) => {
    const { data } = await api.put<ProfileProps>("/profile", input);

    profile.value = data;
  };

  return {
    $all,
    $profileSellers,
    $single,
    index,
    indexSellers,
    show,
    create,
    update,
  };
});
