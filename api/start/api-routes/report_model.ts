import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ReportModelController = () => import('#controllers/report_model/main')

router.get('/report-models', [ReportModelController, 'index']).use(middleware.auth())
router.get('/report-models/:id', [ReportModelController, 'show']).use(middleware.auth())
router.post('/report-models', [ReportModelController, 'store']).use(middleware.auth())
router.put('/report-models', [ReportModelController, 'update']).use(middleware.auth())
router.delete('/report-models/:id', [ReportModelController, 'destroy']).use(middleware.auth())
