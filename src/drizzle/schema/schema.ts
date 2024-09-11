import { pgEnum } from "drizzle-orm/pg-core";

export const paymentType = pgEnum("PaymentType", [
  "CREDIT_CARD",
  "BOLETO",
  "PIX",
]);
export const profileType = pgEnum("ProfileType", [
  "ADMIN",
  "ADVOGADO",
  "MEDICO",
]);
