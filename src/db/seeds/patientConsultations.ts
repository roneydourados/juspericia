import type db from "@/db";
import patientConsultationsData from "./data/patientsConsultations.json";
import { patientConsultations } from "../schema";

export default async function seed(db: db) {
  await db.insert(patientConsultations).values(
    patientConsultationsData.map((patientConsultation) => ({
      userId: patientConsultation.user_id,
      content: patientConsultation.content,
      patientId: patientConsultation.patient_id,
      consultationId: patientConsultation.consultation_id,
      date: patientConsultation.date_open,
      benefitTypeId: patientConsultation.benefit_type_id,
      reportPurposeId: patientConsultation.report_purpose_id,
      consultationValue: String(patientConsultation.consultation_value ?? 0),
    }))
  );
}
