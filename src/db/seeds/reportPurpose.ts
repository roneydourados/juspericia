import type db from "@/db";
import reportPurposesData from "./data/reportPurposes.json";
import { reportPurposes } from "../schema";

export default async function seed(db: db) {
  await db.insert(reportPurposes).values(
    reportPurposesData.map((reportPurpose) => ({
      name: reportPurpose.name,
      id: reportPurpose.id,
    }))
  );
}
