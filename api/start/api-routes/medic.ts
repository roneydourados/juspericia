import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const MedicController = () => import('#controllers/medic/main')

router.get('/medic', [MedicController, 'index']).use(middleware.auth())
router.get('/medic/:id', [MedicController, 'show']).use(middleware.auth())
router.post('/medic', [MedicController, 'store']).use(middleware.auth())
router.put('/medic/:id', [MedicController, 'update']).use(middleware.auth())
router.delete('/medic/:id', [MedicController, 'destroy']).use(middleware.auth())
