import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const BenefitTypeController = () => import('#controllers/benefit_type/main')

router.get('/benefit-type', [BenefitTypeController, 'index']).use(middleware.auth())
router.get('/benefit-type/:id', [BenefitTypeController, 'show']).use(middleware.auth())
router.post('/benefit-type', [BenefitTypeController, 'store']).use(middleware.auth())
router.put('/benefit-type', [BenefitTypeController, 'update']).use(middleware.auth())
router.delete('/benefit-type/:id', [BenefitTypeController, 'destroy']).use(middleware.auth())
