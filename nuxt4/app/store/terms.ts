import { defineStore } from "pinia";

export const useTermsStore = defineStore("terms", () => {
  const { api } = useAxios();
  const termsList = ref<TermsProps[]>([]);
  const terms = ref<TermsProps>();
  const medicalTerms = ref<MedicalTermsProps>();

  const $all = computed(() => termsList.value);
  const $single = computed(() => terms.value);
  const $medicalTerms = computed(() => medicalTerms.value);

  const getAllTerms = async () => {
    const { data } = await api.get<TermsProps[]>("/terms");
    termsList.value = data;
  };

  const getLastTerm = async (category: string) => {
    const config = {
      params: {
        category,
      },
    };

    const { data } = await api.get<TermsProps>("/terms/last", config);

    terms.value = data;
  };

  const store = async ({ content, category }: TermsProps) => {
    await api.post("/terms", { content, category });
  };

  const getMedicalTerms = async () => {
    const { data } = await api.get<MedicalTermsProps>("/terms/medical");
    medicalTerms.value = data;
  };

  return {
    getAllTerms,
    getLastTerm,
    store,
    getMedicalTerms,
    $all,
    $single,
    $medicalTerms,
  };
});
