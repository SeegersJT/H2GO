import Counter from "../models/Counter.model";

export async function getNextSequence(sequenceName: string): Promise<number> {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
