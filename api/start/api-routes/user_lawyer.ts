import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserLawyerEstatisticController = () => import('#controllers/user_lawyer_estatistics/main')
const UserLaywerController = () => import('#controllers/user_lawyer/main')

//usuário advogado
router.get('/user-lawyer', [UserLaywerController, 'index']).use(middleware.auth())
router.get('/user-lawyer/:id', [UserLaywerController, 'show']).use(middleware.auth())
router.post('/user-lawyer', [UserLaywerController, 'store']).use(middleware.auth())
router.put('/user-lawyer', [UserLaywerController, 'update']).use(middleware.auth())
router.delete('/user-lawyer/:id', [UserLaywerController, 'destroy']).use(middleware.auth())

//estatísticas do usuário advogado
router
  .get('/user-lawyer/estatistics', [UserLawyerEstatisticController, 'index'])
  .use(middleware.auth())
