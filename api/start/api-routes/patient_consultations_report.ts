import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PatientConsultationReportController = () =>
  import('#controllers/patient_consultation_report/main')

router
  .get('/patient-consultation-report', [PatientConsultationReportController, 'index'])
  .use(middleware.auth())
router
  .get('/patient-consultation-report/:id', [PatientConsultationReportController, 'show'])
  .use(middleware.auth())
router
  .post('/patient-consultation-report', [PatientConsultationReportController, 'store'])
  .use(middleware.auth())
