import type db from "@/db";
import consultationsData from "./data/consultations.json";
import { consultations } from "../schema";

export default async function seed(db: db) {
  await db.insert(consultations).values(
    consultationsData.map((consultation) => ({
      id: consultation.id,
      consultationName: consultation.consultationName,
      value: String(consultation.value),
      valueCredit: String(consultation.value),
      valuePacket: String(consultation.value),
      valueAntecipation_24: String(consultation.value),
      valueAntecipation_48: String(consultation.value),
      valueAntecipation_72: String(consultation.value),
    }))
  );
}
