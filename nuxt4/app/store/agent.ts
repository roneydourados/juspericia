import type { AgentProps } from "@/types/Agent";
import { defineStore } from "pinia";

export const useAgentStore = defineStore("agent", () => {
  const { api } = useAxios();

  const agent = ref<AgentProps>();
  const agents = ref<AgentProps[]>([]);

  const $all = computed(() => agents.value);
  const $single = computed(() => agent.value);

  const index = async (query: string) => {
    const config = {
      params: {
        query,
      },
    };

    const { data } = await api.get<AgentProps[]>("/agent", config);

    agents.value = data;
  };

  const show = async (publicId: string) => {
    const { data } = await api.get<AgentProps>(`/agent/${publicId}`);

    agent.value = data;
  };

  const create = async (payload: AgentProps) => {
    const { data } = await api.post<AgentProps>("/agent", payload);

    agent.value = data;
  };

  const update = async (payload: AgentProps) => {
    const { data } = await api.put<AgentProps>("/agent", payload);

    agent.value = data;
  };

  const destroy = async (publicId: string) => {
    await api.delete(`/agent/${publicId}`);
  };

  return {
    $all,
    $single,
    index,
    show,
    create,
    update,
    destroy,
  };
});
