import { defineMiddleware } from 'astro/middleware'
import PocketBase from 'pocketbase'

import type { TypedPocketBase } from '@src/data/pocketbase-types'

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.pb = new PocketBase(
    process.env.POCKETBASE_URL
  ) as TypedPocketBase

  // globally disable auto cancellation
  context.locals.pb.autoCancellation(false)

  return next()
})
