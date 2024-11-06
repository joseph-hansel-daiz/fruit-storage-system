import { FruitStorage } from "../domain/entities/FruitStorage";

export interface IFruitStorageRepository {
  exists(name: string): Promise<boolean>;
  findByName(name: string): Promise<FruitStorage>;
  save(fruit: FruitStorage): Promise<void>;
  update(fruit: FruitStorage): Promise<void>;
  delete(name: string): Promise<void>;
  getAll(): Promise<FruitStorage[]>;
  deleteAll(): Promise<void>;
}
