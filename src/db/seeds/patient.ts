import type db from "@/db";
import patientData from "./data/patients.json";
import { patients } from "../schema";

export default async function seed(db: db) {
  await db.insert(patients).values(
    patientData.map((patient) => ({
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf,
      phone: patient.phone,
      email: patient.email,
      userId: patient.userId,
      rg: patient.rg,
      sexy: patient.sexy,
      surname: patient.surname,
      birthDate: patient.birthDate,
    }))
  );
}
