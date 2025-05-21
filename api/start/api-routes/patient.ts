import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PatientController = () => import('#controllers/patient/main')

router.get('/patient', [PatientController, 'index']).use(middleware.auth())
router.get('/patient/:id', [PatientController, 'show']).use(middleware.auth())
router.post('/patient', [PatientController, 'store']).use(middleware.auth())
router.put('/patient/:id', [PatientController, 'update']).use(middleware.auth())
router.delete('/patient/:id', [PatientController, 'destroy']).use(middleware.auth())
