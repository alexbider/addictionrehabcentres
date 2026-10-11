import { requireDb, schema } from '@/db';

export async function audit(actorUserId: string | null, action: string, entity: string, entityId: string | null, data: Record<string, unknown> = {}, ip: string | null = null) {
  try {
    const db = await requireDb();
    await db.insert(schema.auditLog).values({ actorUserId, action, entity, entityId, data, ip });
  } catch (e) { console.error('[audit] failed', e); }
}
