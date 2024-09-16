import type db from "@/db";
import benefitTypeData from "./data/benefitType.json";
import { benefitTypes } from "../schema";

export default async function seed(db: db) {
  await db.insert(benefitTypes).values(
    benefitTypeData.map((benefitType) => ({
      name: benefitType.name,
      id: benefitType.id,
    }))
  );
}
