/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import './api-routes/auth.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
