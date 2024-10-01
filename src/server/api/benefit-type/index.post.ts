import { create } from "@/server/repositories/benefitTypeRepository";
import { BenefitTypeProps } from "@/types/BenefitType";

export default defineEventHandler(async (event) => {
  const body = await readBody<BenefitTypeProps>(event);

  setResponseStatus(event, 200);

  return create(body);
});
