import type { SupabaseClient } from '@supabase/supabase-js';
import type { AdminMenuItem, ShibossCategory } from '../types/admin';
import type { MenuItem } from '../types';

export interface MenuRow {
  id: string;
  code: string;
  name: string;
  category: ShibossCategory;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
  is_customer_visible: boolean;
  is_popular: boolean;
  is_bestseller: boolean;
  badge: string | null;
  updated_at: string;
}

export function mapAdminMenuItem(row: MenuRow): AdminMenuItem {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    category: row.category,
    price: row.price,
    description: row.description,
    image: row.image_url,
    isAvailable: row.is_available,
    isCustomerVisible: row.is_customer_visible,
    isPopular: row.is_popular,
    isBestseller: row.is_bestseller,
    badge: row.badge ?? undefined,
    updatedAt: row.updated_at,
  };
}

export function mapCustomerMenuItem(row: MenuRow): MenuItem {
  const category = row.category === 'Food'
    ? 'makanan'
    : ['Snack', 'Tambahan', 'Varian Telur'].includes(row.category)
      ? 'snack'
      : 'minuman';
  return {
    id: row.id,
    name: row.name,
    category,
    price: row.price,
    description: row.description,
    image: row.image_url,
    badge: row.badge ?? undefined,
    isPopular: row.is_popular,
    isBestseller: row.is_bestseller,
  };
}

export async function loadCustomerMenu(client: SupabaseClient): Promise<MenuItem[]> {
  const { data, error } = await client.from('menu_items')
    .select('*')
    .eq('is_customer_visible', true)
    .eq('is_available', true)
    .order('name');
  if (error) throw error;
  return (data ?? []).map((row) => mapCustomerMenuItem(row as MenuRow));
}

export async function loadAdminMenu(client: SupabaseClient): Promise<AdminMenuItem[]> {
  const { data, error } = await client.from('menu_items').select('*').order('category').order('name');
  if (error) throw error;
  return (data ?? []).map((row) => mapAdminMenuItem(row as MenuRow));
}

export async function upsertMenuItem(client: SupabaseClient, item: AdminMenuItem): Promise<void> {
  const { error } = await client.from('menu_items').upsert({
    id: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
    price: item.price,
    description: item.description,
    image_url: item.image,
    is_available: item.isAvailable,
    is_customer_visible: item.isCustomerVisible ?? false,
    is_popular: Boolean(item.isPopular),
    is_bestseller: Boolean(item.isBestseller),
    badge: item.badge ?? null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function removeMenuItem(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.from('menu_items').delete().eq('id', id);
  if (error) throw error;
}

export async function setMenuAvailability(client: SupabaseClient, id: string, isAvailable: boolean): Promise<void> {
  const { error } = await client.from('menu_items').update({ is_available: isAvailable, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}
