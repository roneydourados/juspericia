import { defineStore } from "pinia";

export const useMedicStore = defineStore("medic", () => {
  const { api } = useAxios();

  const user = ref<UserProps>();
  const users = ref<UserProps[]>([]);
  const medicalSpecialtyMedic = ref<MedicalSpecialtyAssociationsProps>();

  const $single = computed(() => user.value);
  const $all = computed(() => users.value);
  const $medicalSpecialtyMedic = computed(() => medicalSpecialtyMedic.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        inputQuery,
      },
    };

    const { data } = await api.get<UserProps[]>("/medic", config);

    users.value = data;
  };

  const show = async (id: string) => {
    const { data } = await api.get<UserProps>(`/medic/${id}`);

    user.value = data;
  };

  const create = async (input: UserProps) => {
    const { data } = await api.post<UserProps>("/medic", input);

    user.value = data;
  };

  const update = async (input: UserProps) => {
    const { data } = await api.put<UserProps>("/medic", input);

    user.value = data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/medic/${id}`);
  };

  //sobre as especialidades
  const storeMedicalSpecialtyMedic = async (input: {
    medicalSpecialtyId: number;
    medicId: number;
  }) => {
    await api.post("/medic/medical-specialty", input);
  };

  const destroyMedicalSpecialtyMedicSingle = async (id: number) => {
    await api.delete(`/medic/medical-specialty-single/${id}`);
  };

  const destroyMedicalSpecialtyMedic = async (medicId: number) => {
    await api.delete(`/medic/medical-specialty-single/${medicId}`);
  };

  const indexMedicalSpecialtyMedic = async (medicId: number) => {
    const config = {
      params: {
        medicId,
      },
    };

    const { data } = await api.get<MedicalSpecialtyAssociationsProps>(
      "/medic/medical-specialty",
      config
    );

    medicalSpecialtyMedic.value = data;
  };

  return {
    $single,
    $all,
    $medicalSpecialtyMedic,
    index,
    create,
    update,
    destroy,
    show,
    storeMedicalSpecialtyMedic,
    destroyMedicalSpecialtyMedicSingle,
    destroyMedicalSpecialtyMedic,
    indexMedicalSpecialtyMedic,
  };
});
