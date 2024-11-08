import { AppError } from "../../../common/core/error/AppError";
import outboxEventService, {
  OutboxEventService,
} from "../../../common/events/application/OutboxEventService";
import { IFruitStorageRepository } from "../adapter/IFruitStorageRepository";
import { FRUIT_STORAGE_ERRORS } from "../domain/constants/errors.constant";
import { FRUIT_STORAGE_EVENTS } from "../domain/constants/events.constant";
import { FruitStorage } from "../domain/entities/FruitStorage";
import FruitStorageMap from "../infrastructure/FruitStorageMapper";
import fruitStorageRepository from "../infrastructure/FruitStorageRepository";

export class FruitStorageService {
  constructor(
    private fruitStorageRepository: IFruitStorageRepository,
    private outboxEventService: OutboxEventService,
  ) {}

  public async createFruitStorage(
    name: string,
    limitOfFruitToBeStored: number,
  ): Promise<FruitStorage> {
    try {
      const isExistingFruitStorage =
        await this.fruitStorageRepository.exists(name);
      if (isExistingFruitStorage) {
        throw AppError.KnownError.create(
          FRUIT_STORAGE_ERRORS.CANNOT_CREATE_EXISTING_FRUIT_STORAGE,
        );
      }

      const fruit = FruitStorage.create(name, limitOfFruitToBeStored);
      await this.fruitStorageRepository.save(fruit);
      return fruit;
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async updateFruitStorage(
    name: string,
    limitOfFruitToBeStored: number,
  ): Promise<FruitStorage> {
    try {
      const existingFruitStorage =
        await this.fruitStorageRepository.findByName(name);
      existingFruitStorage.updateLimitOfFruitToBeStored(limitOfFruitToBeStored);
      await this.fruitStorageRepository.update(existingFruitStorage);
      return existingFruitStorage;
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async deleteFruitStorage(
    name: string,
    forceDelete: boolean = false,
  ): Promise<void> {
    try {
      const existingFruit = await this.fruitStorageRepository.findByName(name);

      if (!forceDelete && existingFruit.amountInStorage > 0) {
        throw AppError.KnownError.create(
          FRUIT_STORAGE_ERRORS.CANNOT_DELETE_WITH_EXISTING_FRUIT,
        );
      }

      await this.fruitStorageRepository.delete(name);

      await this.outboxEventService.createEvent(
        FRUIT_STORAGE_EVENTS.DELETE,
        FruitStorageMap.toDTO(existingFruit),
      );
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async storeFruit(name: string, amount: number): Promise<FruitStorage> {
    try {
      const fruit = await this.fruitStorageRepository.findByName(name);

      fruit.storeFruit(amount);
      await this.fruitStorageRepository.update(fruit);

      return fruit;
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async removeFruit(
    name: string,
    amount: number,
  ): Promise<FruitStorage> {
    try {
      const fruit = await this.fruitStorageRepository.findByName(name);

      fruit.removeFruit(amount);
      await this.fruitStorageRepository.update(fruit);

      return fruit;
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async findFruitStorage(name: string): Promise<FruitStorage> {
    try {
      return this.fruitStorageRepository.findByName(name);
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async listFruitStorages(): Promise<FruitStorage[]> {
    try {
      return this.fruitStorageRepository.getAll();
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async deleteAllFruitsStorages(): Promise<void> {
    try {
      await this.fruitStorageRepository.deleteAll();
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }
}

const fruitStorageService = new FruitStorageService(
  fruitStorageRepository,
  outboxEventService,
);

export default fruitStorageService;
