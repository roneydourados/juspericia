import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth/main')

router.post('/auth', [AuthController, 'store'])
router.post('/auth/register', [AuthController, 'register'])
router.post('/auth/active-account/:token', [AuthController, 'activeAccount'])
router.post('/auth/forgot-activate-link/:token', [AuthController, 'forgotActivateLink'])
router.post('/auth/forgot-password', [AuthController, 'forgotPassword'])
router.post('/auth/reset-password', [AuthController, 'resetPassword'])
