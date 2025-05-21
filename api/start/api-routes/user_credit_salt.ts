import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserCreditSaltController = () => import('#controllers/user_credit_salt/main')

router.get('/user-credit-salt', [UserCreditSaltController, 'index']).use(middleware.auth())
router
  .get('/user-credit-salt/:id', [UserCreditSaltController, 'getLogCredit'])
  .use(middleware.auth())
