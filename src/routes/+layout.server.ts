import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const { session, user } = await locals.safeGetSession()

  return {
    session,
    user,
  }
}) satisfies LayoutServerLoad