export const SESSION_STATE_KEY = 'shiboss:app-state';

export interface SessionStateEnvelope {
  version: 1;
  customer?: Record<string, unknown>;
  admin?: Record<string, unknown>;
}

type StorageReader = Pick<Storage, 'getItem'>;
type StorageWriter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readSessionState(storage: StorageReader): SessionStateEnvelope | null {
  try {
    const serialized = storage.getItem(SESSION_STATE_KEY);
    if (!serialized) return null;

    const parsed: unknown = JSON.parse(serialized);
    if (!isRecord(parsed) || parsed.version !== 1) return null;

    return {
      version: 1,
      ...(isRecord(parsed.customer) ? { customer: parsed.customer } : {}),
      ...(isRecord(parsed.admin) ? { admin: parsed.admin } : {}),
    };
  } catch {
    return null;
  }
}

export function writeSessionState(
  storage: StorageWriter,
  patch: Pick<SessionStateEnvelope, 'customer' | 'admin'>
): void {
  const current = readSessionState(storage) ?? { version: 1 as const };
  try {
    storage.setItem(
      SESSION_STATE_KEY,
      JSON.stringify({
        version: 1,
        ...(current.customer || patch.customer
          ? { customer: { ...current.customer, ...patch.customer } }
          : {}),
        ...(current.admin || patch.admin ? { admin: { ...current.admin, ...patch.admin } } : {}),
      } satisfies SessionStateEnvelope)
    );
  } catch {
    return;
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('shiboss:session-state'));
  }
}

export function clearSessionState(storage: Pick<Storage, 'removeItem'>): void {
  storage.removeItem(SESSION_STATE_KEY);
}
