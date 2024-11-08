import { Fruit } from "../domain/entities/Fruit";

export interface IFruitRepository {
  exists(name: string): Promise<boolean>;
  findByName(name: string): Promise<Fruit>;
  save(fruit: Fruit): Promise<void>;
  update(fruit: Fruit): Promise<void>;
  delete(name: string): Promise<void>;
  getAll(): Promise<Fruit[]>;
  deleteAll(): Promise<void>;
}
