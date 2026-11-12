import type { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';

/** Local catalog used until Supabase is configured. */
export function getStaticCustomerMenu(): MenuItem[] {
  return MENU_ITEMS;
}
