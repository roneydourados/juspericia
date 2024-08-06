-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_medic_id_fkey" FOREIGN KEY ("medic_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
