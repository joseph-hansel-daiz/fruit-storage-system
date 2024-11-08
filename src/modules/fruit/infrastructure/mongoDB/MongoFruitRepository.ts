import { AppError } from "../../../../common/core/error/AppError";
import { IFruitRepository } from "../../adapter/IFruitRepository";
import { FRUIT_STORAGE_ERRORS } from "../../domain/constants/errors.constant";
import { Fruit } from "../../domain/entities/Fruit";
import FruitMap from "../FruitMapper";
import FruitModel from "./FruitModel";

export class MongoFruitRepository implements IFruitRepository {
  public async exists(name: string): Promise<boolean> {
    const document = await FruitModel.findOne({ name }).lean();
    return !!document;
  }
  public async findByName(name: string): Promise<Fruit> {
    const document = await FruitModel.findOne({ name }).lean();

    if (!document) {
      throw AppError.KnownError.create(FRUIT_STORAGE_ERRORS.CANNOT_READ);
    }

    return FruitMap.toDomain(document);
  }
  public async save(fruit: Fruit): Promise<void> {
    const document = FruitMap.ToMongoDocument(fruit);
    await document.save();
  }
  public async update(fruit: Fruit): Promise<void> {
    await FruitModel.findOneAndUpdate(
      { name: fruit.name },
      FruitMap.toDTO(fruit),
    );
  }
  public async delete(name: string): Promise<void> {
    await FruitModel.deleteOne({ name });
  }
  public async getAll(): Promise<Fruit[]> {
    const documents = await FruitModel.find().lean();
    return documents.map((document) => FruitMap.toDomain(document));
  }
  public async deleteAll(): Promise<void> {
    await FruitModel.deleteMany({});
  }
}
