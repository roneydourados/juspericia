import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserIndicationController = () => import('#controllers/user_indication/main')

router.get('/user-indication', [UserIndicationController, 'index']).use(middleware.auth())
router.get('/user-indication/:id', [UserIndicationController, 'show']).use(middleware.auth())
router.post('/user-indication', [UserIndicationController, 'store']).use(middleware.auth())
router.put('/user-indication', [UserIndicationController, 'update']).use(middleware.auth())
router.delete('/user-indication/:id', [UserIndicationController, 'destroy']).use(middleware.auth())
