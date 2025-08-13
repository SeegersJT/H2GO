import { counterRepository } from "../repositories/Counter.repository";

export class CounterService {
  static async getNextSequence(id: string) {
    return counterRepository.increment(id, 1);
  }
}
