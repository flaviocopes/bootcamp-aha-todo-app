import {
  deleteInvite,
  addActivity,
  getInvite,
  getTeam,
} from '@src/data/pocketbase'

import { getUserUsername } from '@lib/auth'

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ params, locals }) => {
  await deleteInvite(locals.pb, params.invite_id!)

  await addActivity({
    team: team.id,
    project: '',
    text: `Team ${team.name} invite declined by ${await getUserUsername(
      request
    )}}`,
    type: 'invite_declined',
  })

  return new Response(null, {
    status: 204,
    statusText: 'No Content',
    headers: {
      'HX-Redirect': '/app/dashboard',
    },
  })
}
