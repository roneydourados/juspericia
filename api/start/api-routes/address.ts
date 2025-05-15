import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AddressController = () => import('#controllers/address/main')

router.post('/address', [AddressController, 'store']).use(middleware.auth())
router.put('/address', [AddressController, 'update']).use(middleware.auth())
router.delete('/address/:id', [AddressController, 'destroy']).use(middleware.auth())
router.get('/address/:id', [AddressController, 'show']).use(middleware.auth())
