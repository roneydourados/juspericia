import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const SolicitationConsultationController = () =>
  import('#controllers/solicitation_consultation/main')

router
  .post('/solicitation-consultation', [SolicitationConsultationController, 'store'])
  .use(middleware.auth())
router
  .put('/solicitation-consultation', [SolicitationConsultationController, 'update'])
  .use(middleware.auth())
router
  .delete('/solicitation-consultation/:id', [SolicitationConsultationController, 'destroy'])
  .use(middleware.auth())
router
  .get('/solicitation-consultation', [SolicitationConsultationController, 'index'])
  .use(middleware.auth())
router
  .get('/solicitation-consultation/:id', [SolicitationConsultationController, 'show'])
  .use(middleware.auth())
