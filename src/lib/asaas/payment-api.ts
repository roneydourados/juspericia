import axios from "axios";

import { PaymentAsaasProps } from "./types/Payment";
import { PaymentAsaasResponseProps } from "./types/PaymentResponse";

export const useAsaasPayment = () => {
  const apiKey =
    (useRuntimeConfig().asaasApikey as string) ||
    "https://sandbox.asaas.com/api/v3";

  const baseUrl = (useRuntimeConfig().asaasBaseUrl as string) || "";

  const asaasApi = axios.create({
    baseURL: baseUrl,
    headers: {
      accept: "application/json",
      access_token: apiKey,
    },
  });

  const createPayment = async (payload: PaymentAsaasProps) => {
    try {
      payload.billingType = "UNDEFINED"; // deixar o cliente escoher o tipo de cobrança na tela do asaas
      payload.dueDate = formatDate(new Date(payload.dueDate));

      // criar cobrança
      const { data } = await asaasApi.post("/payments", payload);

      return data;
    } catch (error) {
      console.log("🚀 ~ createPayment ~ error:", error);

      throw createError({
        statusCode: 500,
        message: "Erro on create payment!",
      });
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await asaasApi.delete(`/payments/${id}`);
    } catch (error) {
      console.log("🚀 ~ deletePayment ~ error:", error);
      throw createError({
        statusCode: 500,
        message: "Erro on delete payment!",
      });
    }
  };
  return {
    createPayment,
    deletePayment,
  };
};
