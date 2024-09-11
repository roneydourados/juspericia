import { relations } from "drizzle-orm/relations";
import { patientConsultations, schedules, users, patients, patientsConsultationReports, reportModels, profiles, profileRoutes, userLogCredits, benefitTypes, consultations, reportPurposes } from "./schema";

export const schedulesRelations = relations(schedules, ({one}) => ({
	patientConsultation: one(patientConsultations, {
		fields: [schedules.patientConsultationId],
		references: [patientConsultations.id]
	}),
	user: one(users, {
		fields: [schedules.userId],
		references: [users.id]
	}),
}));

export const patientConsultationsRelations = relations(patientConsultations, ({one, many}) => ({
	schedules: many(schedules),
	patientsConsultationReports: many(patientsConsultationReports),
	benefitType: one(benefitTypes, {
		fields: [patientConsultations.benefitTypeId],
		references: [benefitTypes.id]
	}),
	consultation: one(consultations, {
		fields: [patientConsultations.consultationId],
		references: [consultations.id]
	}),
	user: one(users, {
		fields: [patientConsultations.medicId],
		references: [users.id]
	}),
	patient: one(patients, {
		fields: [patientConsultations.patientId],
		references: [patients.id]
	}),
	reportPurpose: one(reportPurposes, {
		fields: [patientConsultations.reportPurposeId],
		references: [reportPurposes.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	schedules: many(schedules),
	patients: many(patients),
	patientsConsultationReports: many(patientsConsultationReports),
	userLogCredits: many(userLogCredits),
	patientConsultations: many(patientConsultations),
	profile: one(profiles, {
		fields: [users.profileId],
		references: [profiles.id]
	}),
}));

export const patientsRelations = relations(patients, ({one, many}) => ({
	user: one(users, {
		fields: [patients.userId],
		references: [users.id]
	}),
	patientConsultations: many(patientConsultations),
}));

export const patientsConsultationReportsRelations = relations(patientsConsultationReports, ({one}) => ({
	patientConsultation: one(patientConsultations, {
		fields: [patientsConsultationReports.patientConsultationId],
		references: [patientConsultations.id]
	}),
	reportModel: one(reportModels, {
		fields: [patientsConsultationReports.reportModelId],
		references: [reportModels.id]
	}),
	user: one(users, {
		fields: [patientsConsultationReports.userId],
		references: [users.id]
	}),
}));

export const reportModelsRelations = relations(reportModels, ({many}) => ({
	patientsConsultationReports: many(patientsConsultationReports),
}));

export const profileRoutesRelations = relations(profileRoutes, ({one}) => ({
	profile: one(profiles, {
		fields: [profileRoutes.profileId],
		references: [profiles.id]
	}),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	profileRoutes: many(profileRoutes),
	users: many(users),
}));

export const userLogCreditsRelations = relations(userLogCredits, ({one}) => ({
	user: one(users, {
		fields: [userLogCredits.userId],
		references: [users.id]
	}),
}));

export const benefitTypesRelations = relations(benefitTypes, ({many}) => ({
	patientConsultations: many(patientConsultations),
}));

export const consultationsRelations = relations(consultations, ({many}) => ({
	patientConsultations: many(patientConsultations),
}));

export const reportPurposesRelations = relations(reportPurposes, ({many}) => ({
	patientConsultations: many(patientConsultations),
}));