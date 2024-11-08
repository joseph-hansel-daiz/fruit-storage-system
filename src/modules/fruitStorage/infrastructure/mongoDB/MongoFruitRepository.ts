import { AppError } from "../../../../common/core/error/AppError";
import { IFruitStorageRepository } from "../../adapter/IFruitStorageRepository";
import { FRUIT_STORAGE_ERRORS } from "../../domain/constants/errors.constant";
import { FruitStorage } from "../../domain/entities/FruitStorage";
import FruitStorageMap from "../FruitStorageMapper";
import FruitStorageModel from "./FruitStorageModel";

export class MongoFruitRepository implements IFruitStorageRepository {
  public async exists(name: string): Promise<boolean> {
    const document = await FruitStorageModel.findOne({ name }).lean();
    return !!document;
  }

  public async findByName(name: string): Promise<FruitStorage> {
    const document = await FruitStorageModel.findOne({ name }).lean();

    if (!document) {
      throw AppError.KnownError.create(FRUIT_STORAGE_ERRORS.CANNOT_READ);
    }

    return FruitStorageMap.toDomain(document);
  }

  public async save(fruit: FruitStorage): Promise<void> {
    const document = FruitStorageMap.ToMongoDocument(fruit);
    await document.save();
  }

  public async update(fruit: FruitStorage): Promise<void> {
    await FruitStorageModel.findOneAndUpdate(
      { name: fruit.name },
      FruitStorageMap.toDTO(fruit),
    );
  }

  public async delete(name: string): Promise<void> {
    await FruitStorageModel.deleteOne({ name });
  }

  public async getAll(): Promise<FruitStorage[]> {
    const documents = await FruitStorageModel.find().lean();
    return documents.map((document) => FruitStorageMap.toDomain(document));
  }

  public async deleteAll(): Promise<void> {
    await FruitStorageModel.deleteMany({});
  }
}
