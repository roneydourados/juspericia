import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ServicePackageController = () => import('#controllers/service_package/main')

router.get('/service-package', [ServicePackageController, 'index']).use(middleware.auth())
router
  .get('/service-package/history/:id', [ServicePackageController, 'getHistory'])
  .use(middleware.auth())
router.post('/service-package', [ServicePackageController, 'store']).use(middleware.auth())
router.put('/service-package', [ServicePackageController, 'update']).use(middleware.auth())
router.delete('/service-package/:id', [ServicePackageController, 'destroy']).use(middleware.auth())
