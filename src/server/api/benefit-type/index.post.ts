import { create } from "./repository/benefitTypeRepository";
import { BenefitTypeProps } from "@/types/Patient";

export default defineEventHandler(async (event) => {
  const body = await readBody<BenefitTypeProps>(event);

  setResponseStatus(event, 200);

  return create(body);
});
