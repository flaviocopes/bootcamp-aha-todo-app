import { addMember, deleteInvite, getInvite } from '@src/data/pocketbase'

import { getCurrentUserId } from '@lib/auth'

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ params, locals }) => {
  const invite = await getInvite(locals.pb, params.invite_id!)

  if (invite) {
    await addMember(locals.pb, invite.team, getCurrentUserId(locals.pb))
    await deleteInvite(locals.pb, params.invite_id!)
  }

  return new Response(null, {
    status: 204,
    statusText: 'No Content',
    headers: {
      'HX-Redirect': invite ? `/app/team/${invite.team}` : '/app/dashboard',
    },
  })
}
