import type { SupabaseClient } from '@supabase/supabase-js';

export type AdminAccessDecision =
  | { status: 'loading' }
  | { status: 'unauthenticated'; redirect: '/admin/login' }
  | { status: 'denied' }
  | { status: 'authorized' };

export function resolveAdminAccess(
  isLoading: boolean,
  userId: string | null,
  isAdmin: boolean
): AdminAccessDecision {
  if (isLoading) return { status: 'loading' };
  if (!userId) return { status: 'unauthenticated', redirect: '/admin/login' };
  if (!isAdmin) return { status: 'denied' };
  return { status: 'authorized' };
}

export async function hasAdminAuthorization(client: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await client
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  return !error && data?.user_id === userId;
}
