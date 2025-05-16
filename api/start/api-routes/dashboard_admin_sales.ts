import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DahsboardSalesAdminController = () => import('#controllers/dashboard_sales_admin/main')

router
  .get('/user-admin/dashboard-sales', [DahsboardSalesAdminController, 'index'])
  .use(middleware.auth())
