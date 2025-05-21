import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ScheduleController = () => import('#controllers/schedule/main')

router.get('/schedule', [ScheduleController, 'index']).use(middleware.auth())
router.get('/schedule/:id', [ScheduleController, 'show']).use(middleware.auth())
router.post('/schedule', [ScheduleController, 'store']).use(middleware.auth())
router.put('/schedule', [ScheduleController, 'update']).use(middleware.auth())
router.delete('/schedule/:id', [ScheduleController, 'destroy']).use(middleware.auth())
