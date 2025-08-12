import BaseRepository from "./Base.repository";
import Counter from "../models/Counter.model";

interface ICounter {
  _id: string;
  seq: number;
}

class CounterRepository extends BaseRepository<ICounter> {
  async next(name: string): Promise<number> {
    const updated = await (Counter as any)
      .findByIdAndUpdate(name, { $inc: { seq: 1 } }, { new: true, upsert: true, setDefaultsOnInsert: true })
      .lean();
    return updated.seq as number;
  }
}

export default new CounterRepository(Counter);
