import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ReportPurposeController = () => import('#controllers/report_purpose/main')

router.get('/report-purposes', [ReportPurposeController, 'index']).use(middleware.auth())
router.get('/report-purposes/:id', [ReportPurposeController, 'show']).use(middleware.auth())
router.post('/report-purposes', [ReportPurposeController, 'store']).use(middleware.auth())
router.put('/report-purposes', [ReportPurposeController, 'update']).use(middleware.auth())
router.delete('/report-purposes/:id', [ReportPurposeController, 'destroy']).use(middleware.auth())
