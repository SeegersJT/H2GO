import { CounterRepository } from "../repositories/Counter.repository";

export class CounterService {
  static getNextSequence = async (sequenceName: string): Promise<number> => {
    return await CounterRepository.getNextSequence(sequenceName);
  };
}
