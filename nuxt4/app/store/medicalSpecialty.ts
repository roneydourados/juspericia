import { defineStore } from "pinia";

export const useMedicalSpecialtyStore = defineStore("medicalSpecialty", () => {
  const { api } = useAxios();

  const medicalSpecialties = ref<MedicalSpecialtyListResponse>();
  const medicalSpecialtie = ref<MedicalSpecialtySingleResponse>();

  const $all = computed(() => medicalSpecialties.value);
  const $single = computed(() => medicalSpecialtie.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        inputQuery,
      },
    };

    const { data } = await api.get<MedicalSpecialtyListResponse>(
      "/medical-specialty",
      config
    );

    medicalSpecialties.value = data;
  };

  const show = async (publicId: number) => {
    const { data } = await api.get<MedicalSpecialtySingleResponse>(
      `/medical-specialty/${publicId}`
    );

    medicalSpecialtie.value = data;
  };

  const store = async (payload: MedicalSpecialtyProps) => {
    const { data } = await api.post<MedicalSpecialtySingleResponse>(
      "/medical-specialty",
      payload
    );

    medicalSpecialtie.value = data;
  };

  const update = async (payload: MedicalSpecialtyProps) => {
    const { data } = await api.put<MedicalSpecialtySingleResponse>(
      "/medical-specialty",
      payload
    );

    medicalSpecialtie.value = data;
  };

  const destroy = async (publicId: string) => {
    await api.delete(`/medical-specialty/${publicId}`);
  };

  return {
    $all,
    $single,
    index,
    show,
    store,
    update,
    destroy,
  };
});
