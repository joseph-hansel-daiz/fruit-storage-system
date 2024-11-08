import { FruitStorage } from "../domain/entities/FruitStorage";
import { FruitStorageDTO } from "../dtos/FruitStorageDTO";
import FruitStorageModel, {
  IFruitStorageDocument,
} from "./mongoDB/FruitStorageModel";

export default class FruitStorageMap {
  public static toDTO(fruitStorage: FruitStorage): FruitStorageDTO {
    return {
      name: fruitStorage.name,
      limitOfFruitToBeStored: fruitStorage.limitOfFruitToBeStored,
      amountInStorage: fruitStorage.amountInStorage,
    };
  }

  public static toDomain(raw: any): FruitStorage {
    return FruitStorage.create(
      raw.name,
      raw.limitOfFruitToBeStored,
      raw.amountInStorage,
    );
  }

  public static ToMongoDocument(fruit: FruitStorage): IFruitStorageDocument {
    return new FruitStorageModel({
      name: fruit.name,
      limitOfFruitToBeStored: fruit.limitOfFruitToBeStored,
      amountInStorage: fruit.amountInStorage,
    });
  }
}
