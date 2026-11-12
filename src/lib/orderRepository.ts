import type { SupabaseClient } from '@supabase/supabase-js';
import type { ActiveOrder, CartItem, ItemModifier, MenuItem } from '../types';
import type { AdminOrder, AdminOrderItem, OrderStatus, QrisTransaction } from '../types/admin';

export interface CreateOrderInput {
  tableNumber: string;
  customerName: string;
  kitchenNotes: string;
  paymentMethod: 'qris' | 'cash';
  cartItems: CartItem[];
  requestId?: string;
  accessToken: string;
}

export interface CreateOrderParams {
  p_table_number: string;
  p_customer_name: string;
  p_kitchen_notes: string;
  p_payment_method: 'qris' | 'cash';
  p_request_id: string;
  p_customer_access_token: string;
  p_items: Array<{ menu_item_id: string; quantity: number; modifier: ItemModifier | null; notes: string }>;
}

interface CreatedOrderRow {
  id: string;
  order_number: string;
  subtotal: number;
  total: number;
  payment_status: ActiveOrder['paymentStatus'];
  table_number?: string;
  customer_name?: string;
  order_status?: OrderStatus;
  payment_method?: 'qris' | 'cash';
  kitchen_notes?: string;
  created_at?: string;
  transfer_proof_path?: string | null;
  cancellation_reason?: string | null;
  items: Array<{
    menu_item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    modifier: ItemModifier;
    notes: string;
  }>;
}

export function buildCreateOrderParams(input: CreateOrderInput): CreateOrderParams {
  return {
    p_table_number: input.tableNumber,
    p_customer_name: input.customerName,
    p_kitchen_notes: input.kitchenNotes,
    p_payment_method: input.paymentMethod,
    p_request_id: input.requestId ?? crypto.randomUUID(),
    p_customer_access_token: input.accessToken,
    p_items: input.cartItems.map((item) => ({
      menu_item_id: item.item.id,
      quantity: item.quantity,
      modifier: item.modifier ?? null,
      notes: item.notes ?? '',
    })),
  };
}

const customerCategory = (category: string): MenuItem['category'] => category === 'Food'
  ? 'makanan'
  : ['Snack', 'Tambahan', 'Varian Telur'].includes(category)
    ? 'snack'
    : 'minuman';

export function mapCreatedOrder(row: CreatedOrderRow, input: Omit<CreateOrderInput, 'requestId'>): ActiveOrder {
  const originalItems = new Map(input.cartItems.map((item) => [item.item.id, item.item]));
  const items: CartItem[] = row.items.map((item, index) => {
    const original = originalItems.get(item.menu_item_id);
    const menuItem: MenuItem = {
      id: item.menu_item_id,
      name: item.item_name,
      category: customerCategory(item.category),
      price: original?.price ?? item.unit_price,
      description: original?.description ?? '',
      image: original?.image ?? '',
    };
    return {
      cartItemId: `${row.id}-${index}`,
      item: menuItem,
      quantity: item.quantity,
      modifier: item.modifier,
      notes: item.notes,
      unitPrice: item.unit_price,
    };
  });

  return {
    orderId: row.order_number,
    databaseId: row.id,
    accessToken: input.accessToken,
    tableNumber: input.tableNumber,
    customerName: input.customerName,
    items,
    subtotal: row.subtotal,
    tax: 0,
    discount: 0,
    total: row.total,
    paymentMethod: input.paymentMethod,
    isPaid: row.payment_status === 'terverifikasi' || row.payment_status === 'tunai_lunas',
    paymentStatus: row.payment_status,
    status: 'menunggu',
    createdAt: new Date().toISOString(),
    kitchenNotes: input.kitchenNotes,
  };
}

export async function createDineInOrder(client: SupabaseClient, input: CreateOrderInput): Promise<ActiveOrder> {
  const params = buildCreateOrderParams(input);
  const { data, error } = await client.rpc('create_dine_in_order', params);
  if (error) throw error;
  return mapCreatedOrder(data as CreatedOrderRow, input);
}

export async function fetchCustomerOrder(client: SupabaseClient, order: ActiveOrder): Promise<ActiveOrder> {
  if (!order.databaseId || !order.accessToken) throw new Error('Kunci akses pesanan tidak tersedia.');
  const { data, error } = await client.rpc('get_customer_order', {
    p_order_id: order.databaseId,
    p_customer_access_token: order.accessToken,
  });
  if (error) throw error;
  const row = data as CreatedOrderRow;
  const refreshed = mapCreatedOrder(row, {
    tableNumber: row.table_number ?? order.tableNumber,
    customerName: row.customer_name ?? order.customerName ?? '',
    kitchenNotes: row.kitchen_notes ?? '',
    paymentMethod: row.payment_method ?? order.paymentMethod,
    cartItems: order.items,
    accessToken: order.accessToken,
  });
  return {
    ...refreshed,
    createdAt: row.created_at ?? order.createdAt,
    status: row.order_status ?? order.status,
    transferProofPath: row.transfer_proof_path ?? undefined,
    cancellationReason: row.cancellation_reason ?? undefined,
    transferProofImage: order.transferProofImage,
  };
}

export async function uploadCustomerProof(
  client: SupabaseClient,
  order: ActiveOrder,
  file: File
): Promise<string> {
  if (!order.databaseId || !order.accessToken) throw new Error('Kunci akses pesanan tidak tersedia.');
  const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(extension)) throw new Error('Format gambar tidak didukung.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 5 MB.');
  const path = `${order.databaseId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await client.storage.from('transfer-proofs').upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;
  const { error } = await client.rpc('submit_transfer_proof', {
    p_order_id: order.databaseId,
    p_customer_access_token: order.accessToken,
    p_object_path: path,
  });
  if (error) throw error;
  return path;
}

interface AdminOrderRow {
  id: string;
  order_number: string;
  table_number: string;
  customer_name: string;
  subtotal: number;
  tax: number;
  total: number;
  payment_method: 'qris' | 'cash';
  payment_status: AdminOrder['paymentStatus'];
  order_status: OrderStatus;
  kitchen_notes: string;
  cancellation_reason: string | null;
  verified_by: string | null;
  verified_at: string | null;
  transfer_proof_path: string | null;
  created_at: string;
  order_items: Array<{ id: string; menu_item_id: string | null; item_name: string; category: AdminOrderItem['category']; quantity: number; unit_price: number; subtotal: number; modifier: AdminOrderItem['modifier']; notes: string }>;
}

export async function loadAdminOrders(client: SupabaseClient): Promise<AdminOrder[]> {
  const { data, error } = await client.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((raw) => {
    const row = raw as unknown as AdminOrderRow;
    return {
      id: row.order_number,
      databaseId: row.id,
      tableNumber: `Meja ${row.table_number}`,
      customerName: row.customer_name,
      items: (row.order_items ?? []).map((item) => ({
        itemId: item.menu_item_id ?? item.id,
        name: item.item_name,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal,
        modifier: item.modifier,
        notes: item.notes,
      })),
      subtotal: row.subtotal,
      tax: row.tax,
      total: row.total,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      orderStatus: row.order_status,
      createdAt: row.created_at,
      customerNotes: row.kitchen_notes,
      cancellationReason: row.cancellation_reason ?? undefined,
      verifiedBy: row.verified_by ?? undefined,
      verifiedAt: row.verified_at ?? undefined,
      transferProofImage: undefined,
      transferProofPath: row.transfer_proof_path ?? undefined,
    };
  });
}

interface PaymentRow {
  id: string;
  order_id: string;
  amount: number;
  status: QrisTransaction['status'] | 'tunai_lunas';
  rrn: string | null;
  issuer: string | null;
  terminal_id: string | null;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  transfer_proof_path: string | null;
  created_at: string;
  orders: { id: string; order_number: string; customer_name: string; table_number: string; created_at: string };
}

export async function loadQrisTransactions(client: SupabaseClient): Promise<QrisTransaction[]> {
  const { data, error } = await client.from('payments')
    .select('*, orders!inner(id, order_number, customer_name, table_number, created_at)')
    .eq('orders.payment_method', 'qris')
    .neq('status', 'tunai_lunas')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return Promise.all((data ?? []).map(async (raw) => {
    const row = raw as unknown as PaymentRow;
    let transferProofImage: string | undefined;
    if (row.transfer_proof_path) {
      const { data: signed } = await client.storage.from('transfer-proofs').createSignedUrl(row.transfer_proof_path, 600);
      transferProofImage = signed?.signedUrl;
    }
    return {
      id: row.id,
      databaseOrderId: row.order_id,
      orderId: row.orders.order_number,
      customerName: row.orders.customer_name || `Pelanggan Meja ${row.orders.table_number}`,
      tableNumber: `Meja ${row.orders.table_number}`,
      amount: row.amount,
      createdAt: row.created_at,
      status: row.status as QrisTransaction['status'],
      rrn: row.rrn ?? '',
      issuer: row.issuer ?? '',
      terminalId: row.terminal_id ?? '',
      verifiedBy: row.verified_by ?? undefined,
      verifiedAt: row.verified_at ?? undefined,
      rejectionReason: row.rejection_reason ?? undefined,
      transferProofImage,
    };
  }));
}

export async function updateOrderStatus(client: SupabaseClient, orderId: string, status: OrderStatus, reason?: string): Promise<void> {
  const { error } = await client.rpc('admin_set_order_status', { p_order_id: orderId, p_status: status, p_reason: reason ?? null });
  if (error) throw error;
}

export async function updateQrisStatus(client: SupabaseClient, transaction: QrisTransaction, status: 'terverifikasi' | 'ditolak', reason?: string): Promise<void> {
  if (!transaction.databaseOrderId) throw new Error('ID pesanan database tidak tersedia.');
  const { error } = await client.rpc('admin_update_qris', {
    p_order_id: transaction.databaseOrderId,
    p_status: status,
    p_reason: reason ?? null,
    p_rrn: transaction.rrn || null,
    p_issuer: transaction.issuer || null,
    p_terminal_id: transaction.terminalId || null,
  });
  if (error) throw error;
}

export async function markCashPaymentPaid(client: SupabaseClient, orderId: string): Promise<void> {
  const { error } = await client.rpc('admin_mark_cash_paid', { p_order_id: orderId });
  if (error) throw error;
}
