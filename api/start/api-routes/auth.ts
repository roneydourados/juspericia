import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth/main')

router.post('/auth', [AuthController, 'store'])
router.post('/auth/register', [AuthController, 'register'])
