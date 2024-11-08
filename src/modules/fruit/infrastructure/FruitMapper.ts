import { Fruit } from "../domain/entities/Fruit";
import { FruitDTO } from "../dtos/FruitDTO";
import FruitModel, { IFruitDocument } from "./mongoDB/FruitModel";

export default class FruitMap {
  public static toDTO(fruitStorage: Fruit): FruitDTO {
    return {
      name: fruitStorage.name,
      description: fruitStorage.description,
      limitOfFruitToBeStored: fruitStorage.limitOfFruitToBeStored,
    };
  }

  public static toDomain(raw: any): Fruit {
    return Fruit.create(raw.name, raw.description, raw.limitOfFruitToBeStored);
  }

  public static ToMongoDocument(fruit: Fruit): IFruitDocument {
    return new FruitModel({
      name: fruit.name,
      description: fruit.description,
      limitOfFruitToBeStored: fruit.limitOfFruitToBeStored,
    });
  }
}
