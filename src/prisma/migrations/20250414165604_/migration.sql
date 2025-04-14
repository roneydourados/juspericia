-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_medic_id_fkey" FOREIGN KEY ("medic_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_report_purpose_id_fkey" FOREIGN KEY ("report_purpose_id") REFERENCES "report_purposes"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_benefit_type_id_fkey" FOREIGN KEY ("benefit_type_id") REFERENCES "benefit_types"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_patient_consultation_id_fkey" FOREIGN KEY ("patient_consultation_id") REFERENCES "patient_consultations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "profile_routes" ADD CONSTRAINT "profile_routes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "service_package_history" ADD CONSTRAINT "service_package_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user_credit_log" ADD CONSTRAINT "user_credit_log_user_credit_id_fkey" FOREIGN KEY ("user_credit_id") REFERENCES "user_credits"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_solicitation_id_fkey" FOREIGN KEY ("solicitation_id") REFERENCES "patient_consultations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_medic_id_fkey" FOREIGN KEY ("medic_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_patient_consultation_id_fkey" FOREIGN KEY ("patient_consultation_id") REFERENCES "patient_consultations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
