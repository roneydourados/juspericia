import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AsaasController = () => import('#controllers/asaas/main')

router.post('/asaas/customer', [AsaasController, 'createCustomer']).use(middleware.auth())
router.post('/asaas/payment', [AsaasController, 'createPayment']).use(middleware.auth())
router.delete('/asaas/payment/:id', [AsaasController, 'destroy']).use(middleware.auth())

router.post('/asaas/webhook/payment', [AsaasController, 'paymentWebhook'])
