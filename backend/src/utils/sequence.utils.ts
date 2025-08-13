import Counter from "../models/Counter.model";

/** Atomically gets next sequence for a category+scope. */
export async function nextSeq(category: string, scope: string, step = 1): Promise<number> {
  const key = `${category}:${scope}`;
  const doc = await Counter.findByIdAndUpdate(key, { $inc: { seq: step } }, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
  return doc!.seq;
}

/** Formats "CAT-SCOPE-0001" with configurable padding (default 4). */
export function formatHumanCode(category: string, scope: string, seq: number, pad = 4): string {
  return `${category}-${scope}-${String(seq).padStart(pad, "0")}`;
}
