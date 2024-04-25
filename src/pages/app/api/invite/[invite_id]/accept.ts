import {
  addMember,
  deleteInvite,
  getInvite,
  addActivity,
  getTeam,
} from '@src/data/pocketbase'

import { getCurrentUserId, getUserUsername } from '@lib/auth'

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ params, locals }) => {
  const invite = await getInvite(locals.pb, params.invite_id!)

  if (invite) {
    await addMember(locals.pb, invite.team, getCurrentUserId(locals.pb))
    await deleteInvite(locals.pb, params.invite_id!)
  }

  await addActivity({
    team: team.id,
    project: '',
    text: `Team ${team.name} invite accepted by ${await getUserUsername(
      request
    )}}`,
    type: 'invite_accepted',
  })

  return new Response(null, {
    status: 204,
    statusText: 'No Content',
    headers: {
      'HX-Redirect': invite ? `/app/team/${invite.team}` : '/app/dashboard',
    },
  })
}
