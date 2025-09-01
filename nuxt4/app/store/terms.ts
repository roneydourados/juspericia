import { defineStore } from "pinia";

export const useTermsStore = defineStore("terms", () => {
  const { api } = useAxios();
  const termsList = ref<TermsProps[]>([]);
  const terms = ref<TermsProps>();

  const $all = computed(() => termsList.value);
  const $single = computed(() => terms.value);

  const getAllTerms = async () => {
    const { data } = await api.get<TermsProps[]>("/terms");
    termsList.value = data;
  };

  const getLastTerm = async () => {
    const { data } = await api.get<TermsProps>("/terms/last");
    terms.value = data;
  };

  const store = async ({ content }: TermsProps) => {
    await api.post("/terms", { content });
  };

  return {
    getAllTerms,
    getLastTerm,
    store,
    $all,
    $single,
  };
});
