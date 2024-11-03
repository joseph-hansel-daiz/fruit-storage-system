import { FruitStorage } from "../domain/FruitStorage";

export interface IFruitStorageRepository {
    findByName(name: string): Promise<FruitStorage>;
    save(fruit: FruitStorage): Promise<void>;
    update(fruit: FruitStorage): Promise<FruitStorage>;
    delete(name: string): Promise<void>;
    getAll(): Promise<FruitStorage[]>;
    deleteAll(): Promise<void>;
}
