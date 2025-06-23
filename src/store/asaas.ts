import { CustomerProps } from "@/types/assaas/Customer";
import {
  PaymentAsaasProps,
  PaymentSimulationReponseProps,
} from "@/types/assaas/Payment";
import { defineStore } from "pinia";

export const useAsaasStore = defineStore("asaas", () => {
  const { api } = useAxios();
  const paymentReponse = ref();
  const paymentSimulationResponse = ref<PaymentSimulationReponseProps>();
  const $paymentReponse = computed(() => paymentReponse.value);
  const $paymentSimulation = computed(() => paymentSimulationResponse.value);

  const createCustomer = async (payload: CustomerProps) => {
    await api.post("/asaas/customer", payload);
  };

  const createPayment = async (payload: PaymentAsaasProps) => {
    paymentReponse.value = await api.post("/asaas/payment", payload);
  };

  const deletePayment = async (id: string) => {
    await api.delete(`/asaas/payment/${id}`);
  };

  const paymentSimulation = async (input: {
    value: number;
    installmentCount?: number;
    billingType: string;
  }) => {
    const { value, installmentCount, billingType } = input;

    const payload = {
      value,
      installmentCount,
      billingType,
    };

    const { data } = await api.post<PaymentSimulationReponseProps>(
      "/asaas/payment/simulation",
      payload
    );

    paymentSimulationResponse.value = data;
  };

  return {
    createCustomer,
    createPayment,
    deletePayment,
    $paymentReponse,
    $paymentSimulation,
    paymentSimulation,
  };
});
