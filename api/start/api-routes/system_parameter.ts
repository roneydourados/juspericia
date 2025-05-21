import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const SystemParameterController = () => import('#controllers/system_parameter/main')

router.get('/system-parameters', [SystemParameterController, 'index']).use(middleware.auth())
router.put('/system-parameters', [SystemParameterController, 'update']).use(middleware.auth())
