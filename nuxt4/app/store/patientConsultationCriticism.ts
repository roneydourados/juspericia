import { defineStore } from "pinia";

export const usePatientConsultationCriticismStore = defineStore(
  "patientConsultationCriticism",
  () => {
    const { api } = useAxios();

    const criticisms = ref<PatientConsultationCriticismsList>();
    const criticism = ref<PatientConsultationCriticismsSingle>();

    const $all = computed(() => criticisms.value);
    const $single = computed(() => criticism.value);

    const listCriticisms = async (patientConsultationId: number) => {
      const config = {
        params: {
          id: patientConsultationId,
        },
      };
      const { data } = await api.get<PatientConsultationCriticismsList>(
        "/patient-consultation-criticism",
        config
      );
      criticisms.value = data;
    };

    const getCriticismDetails = async (id: number) => {
      const { data } = await api.get<PatientConsultationCriticismsSingle>(
        `/patient-consultation-criticism/${id}`
      );
      criticism.value = data;
    };

    const createCriticism = async ({
      patientConsultationId,
      description,
    }: PatientConsultationCriticismsProps) => {
      const payload = {
        patientConsultationId,
        description,
      };
      await api.post<PatientConsultationCriticismsSingle>(
        "/patient-consultation-criticism",
        payload
      );
    };

    const addMessage = async ({
      patientConsultationCriticismId,
      userId,
      message,
    }: PatientConsultationCriticismsMessagesProps) => {
      const payload = {
        patientConsultationCriticismId,
        userId,
        message,
      };
      await api.post("/patient-consultation-criticism/message", payload);
    };

    const updateCriticism = async ({
      id,
      status,
      description,
    }: PatientConsultationCriticismsProps) => {
      const payload = {
        status,
        id,
        description,
      };
      await api.put("/patient-consultation-criticism", payload);
    };

    return {
      $all,
      $single,
      listCriticisms,
      getCriticismDetails,
      createCriticism,
      addMessage,
      updateCriticism,
    };
  }
);
