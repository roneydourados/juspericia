import { defineStore } from "pinia";

export const usePatientStore = defineStore("patient", () => {
  const { api } = useAxios();

  const patient = ref<PatientProps>();
  const patients = ref<PatientProps[]>([]);
  const solicitations = ref<SolicitationConsultationProps[]>([]);
  const $solicitations = computed(() => solicitations.value);
  const $single = computed(() => patient.value);
  const $all = computed(() => patients.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        inputQuery,
      },
    };

    const { data } = await api.get<PatientProps[]>("/patient", config);

    patients.value = data;
  };

  const show = async (id: string) => {
    const { data } = await api.get<PatientProps>(`/patient/${id}`);

    patient.value = data;
  };

  const getSolicitations = async (publicId: string) => {
    const { data } = await api.get<SolicitationConsultationProps[]>(
      `/patient/solicitations/${publicId}`
    );

    console.log("🚀 ~ getSolicitations ~ data:", data);

    solicitations.value = data;
  };

  const create = async (input: PatientProps) => {
    const { data } = await api.post<PatientProps>("/patient", input);

    patient.value = data;
  };

  const update = async (input: PatientProps) => {
    const { data } = await api.put<PatientProps>("/patient", input);

    patient.value = data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/patient/${id}`);
  };

  return {
    $single,
    $all,
    $solicitations,
    index,
    create,
    update,
    destroy,
    show,
    getSolicitations,
  };
});
