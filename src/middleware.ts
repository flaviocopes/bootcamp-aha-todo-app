import { defineMiddleware } from 'astro/middleware'

import PocketBase from 'pocketbase'

import type { TypedPocketBase } from '@src/data/pocketbase-types'

import { isLoggedIn, isUserVerified } from '@lib/auth'

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.pb = new PocketBase(
    process.env.POCKETBASE_URL
  ) as TypedPocketBase

  // globally disable auto cancellation
  context.locals.pb.autoCancellation(false)

  if (!(await isLoggedIn(context.locals.pb, context.request))) {
    if (context.url.pathname.startsWith('/app/api')) {
      return new Response('Unauthorized', {
        status: 401,
      })
    }

    if (context.url.pathname.startsWith('/app')) {
      return context.redirect('/login')
    }
  }

  if (await isLoggedIn(context.locals.pb, context.request)) {
    const verified = await isUserVerified(context.locals.pb)
    if (!verified) {
      if (context.url.pathname.startsWith('/app')) {
        return context.redirect('/verify')
      }
    } else {
      if (context.url.pathname === '/verify') {
        return context.redirect('/app/dashboard')
      }
    }
  }

  return next()
})
