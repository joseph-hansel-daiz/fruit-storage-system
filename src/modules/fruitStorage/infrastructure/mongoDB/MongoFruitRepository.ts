import { IFruitStorageRepository } from "../../adapter/IFruitStorageRepository";
import { FRUIT_STORAGE_ERRORS } from "../../domain/constants/errors.constant";
import { FruitStorage } from "../../domain/entities/FruitStorage";
import FruitStorageMap from "../FruitMapper";
import FruitStorageModel from "./FruitStorageModel";

export class MongoFruitRepository implements IFruitStorageRepository {
  public async findByName(name: string): Promise<FruitStorage> {
    const document = await FruitStorageModel.findOne({ name }).lean();

    if (!document) {
      throw new Error(FRUIT_STORAGE_ERRORS.CANNOT_READ);
    }

    return FruitStorageMap.toDomain(document);
  }

  public async save(fruit: FruitStorage): Promise<void> {
    const document = FruitStorageMap.ToMongoDocument(fruit);

    try {
      await document.save();
    } catch {
      throw new Error(FRUIT_STORAGE_ERRORS.CANNOT_CREATE);
    }
  }

  public async update(fruit: FruitStorage): Promise<void> {
    try {
      await FruitStorageModel.findOneAndUpdate(
        { name: fruit.name },
        FruitStorageMap.toDTO(fruit),
      ).lean();
    } catch (error) {
      throw new Error(FRUIT_STORAGE_ERRORS.CANNOT_UPDATE);
    }
  }

  public async delete(name: string): Promise<void> {
    try {
      await FruitStorageModel.deleteOne({ name });
    } catch {
      throw new Error(FRUIT_STORAGE_ERRORS.CANNOT_DELETE);
    }
  }

  public async getAll(): Promise<FruitStorage[]> {
    const documents = await FruitStorageModel.find().lean();
    return documents.map((document) => FruitStorageMap.toDomain(document));
  }

  public async deleteAll(): Promise<void> {
    try {
      await FruitStorageModel.deleteMany({});
    } catch {
      throw new Error(FRUIT_STORAGE_ERRORS.CANNOT_DELETE_ALL);
    }
  }
}
