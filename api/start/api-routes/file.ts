import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FileController = () => import('#controllers/file/main')

router.post('files/aws', [FileController, 'store']).use(middleware.auth())
router.post('files/aws/upload-many', [FileController, 'storeMany']).use(middleware.auth())
router.delete('files/aws/:id', [FileController, 'destroy']).use(middleware.auth())
router.get('files/aws/:id', [FileController, 'download']).use(middleware.auth())
