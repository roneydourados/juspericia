import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
console.log('🔍 CORS_ORIGIN:', env.get('CORS_ORIGIN'))

const corsConfig = defineConfig({
  enabled: true,
  origin: [env.get('CORS_ORIGIN', '*')],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  exposeHeaders: [
    'cache-control',
    'content-language',
    'content-type',
    'expires',
    'last-modified',
    'pragma',
  ],
  credentials: true,
  maxAge: 90,
  // enabled: true,
  // origin: true,
  // methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  // headers: true,
  // exposeHeaders: [],
  // credentials: true,
  // maxAge: 90,
})

export default corsConfig
