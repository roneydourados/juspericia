import { defineStore } from "pinia";

export const useAtendentMedicStore = defineStore("atendentMedic", () => {
  const { api } = useAxios();

  const atendentMedics = ref<AtendentMedicListProps>();
  const patientConsultationReports = ref<PatientConsultationReportListProps[]>(
    []
  );
  const medics = ref<{ medics: UserProps[] }>();

  const $all = computed(() => atendentMedics.value);
  const $consultationReportsList = computed(
    () => patientConsultationReports.value
  );
  const $medics = computed(() => medics.value?.medics || []);

  const index = async (atendentId: number) => {
    const config = {
      params: {
        atendentId,
      },
    };

    const { data } = await api.get<AtendentMedicListProps>(
      "/atendent-medic",
      config
    );

    atendentMedics.value = data;
  };

  const setMedics = async (input: AtendentMedicProps[]) => {
    await api.post<AtendentMedicProps[]>("/atendent-medic", input);
  };

  const clearAssociations = async (atendentId: number) => {
    await api.delete(`/atendent-medic/${atendentId}`);
  };

  const getConsultationReports = async (input: {
    initialDate: string;
    finalDate: string;
    patientId?: number;
    medicId?: number;
    emitReport?: boolean;
    justify?: boolean;
  }) => {
    const { finalDate, initialDate, patientId, emitReport, medicId, justify } =
      input;

    const config = {
      params: {
        initialDate,
        finalDate,
        patientId,
        emitReport,
        medicId,
        justify,
      },
    };

    const { data } = await api.get<PatientConsultationReportListProps[]>(
      "/atendent-medic/reports",
      config
    );

    patientConsultationReports.value = data;
  };

  const getMedics = async () => {
    const { data } = await api.get<{ medics: UserProps[] }>(
      "/atendent-medic/medics"
    );
    medics.value = data;
  };

  return {
    $all,
    $consultationReportsList,
    $medics,
    index,
    setMedics,
    clearAssociations,
    getConsultationReports,
    getMedics,
  };
});
