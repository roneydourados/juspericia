import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ConsultationController = () => import('#controllers/consultation/main')

router.get('/consultation', [ConsultationController, 'index']).use(middleware.auth())
router.get('/consultation/:id', [ConsultationController, 'show']).use(middleware.auth())
router.post('/consultation', [ConsultationController, 'store']).use(middleware.auth())
router.put('/consultation/:id', [ConsultationController, 'update']).use(middleware.auth())
router.delete('/consultation/:id', [ConsultationController, 'destroy']).use(middleware.auth())
