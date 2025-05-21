import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserAdminController = () => import('#controllers/user_admin/main')

router.get('/user-admin', [UserAdminController, 'index']).use(middleware.auth())
router.get('/user-admin/:id', [UserAdminController, 'show']).use(middleware.auth())
router.post('/user-admin', [UserAdminController, 'store']).use(middleware.auth())
router.put('/user-admin', [UserAdminController, 'update']).use(middleware.auth())
router.delete('/user-admin/:id', [UserAdminController, 'destroy']).use(middleware.auth())
