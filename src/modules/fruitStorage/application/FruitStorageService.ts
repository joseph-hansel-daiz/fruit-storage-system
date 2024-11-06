import { AppError } from "../../../common/core/error/AppError";
import outboxEventService, {
  OutboxEventService,
} from "../../../common/events/application/OutboxEventService";
import { IFruitStorageRepository } from "../adapter/IFruitStorageRepository";
import { FRUIT_STORAGE_ERRORS } from "../domain/constants/errors.constant";
import { FRUIT_STORAGE_EVENTS } from "../domain/constants/events.constant";
import { FruitStorage } from "../domain/entities/FruitStorage";
import FruitStorageMap from "../infrastructure/FruitMapper";
import fruitStorageRepository from "../infrastructure/FruitStorageRepository";

export class FruitStorageService {
  constructor(
    private fruitRepository: IFruitStorageRepository,
    private outboxEventService: OutboxEventService,
  ) {}

  public async createFruitStorage(
    name: string,
    description: string,
    limitOfFruitToBeStored: number,
  ): Promise<FruitStorage> {
    try {
      const isExistingFruitStorage = await this.fruitRepository.exists(name);
      if (isExistingFruitStorage) {
        throw AppError.KnownError.create(
          FRUIT_STORAGE_ERRORS.CANNOT_CREATE_EXISTING_FRUIT,
        );
      }

      const fruit = FruitStorage.create(
        name,
        description,
        limitOfFruitToBeStored,
      );
      await this.fruitRepository.save(fruit);
      await this.outboxEventService.createEvent(
        FRUIT_STORAGE_EVENTS.CREATE,
        FruitStorageMap.toDTO(fruit),
      );
      return fruit;
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async updateFruitStorage(
    name: string,
    description: string,
    limitOfFruitToBeStored: number,
  ): Promise<FruitStorage> {
    try {
      const existingFruit = await this.fruitRepository.findByName(name);

      existingFruit.updateDescription(description);
      existingFruit.updateLimitOfFruitToBeStored(limitOfFruitToBeStored);

      await this.fruitRepository.update(existingFruit);
      await this.outboxEventService.createEvent(
        FRUIT_STORAGE_EVENTS.UPDATE,
        FruitStorageMap.toDTO(existingFruit),
      );
      return existingFruit;
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async deleteFruitStorage(
    name: string,
    forceDelete: boolean = false,
  ): Promise<void> {
    try {
      const existingFruit = await this.fruitRepository.findByName(name);

      if (!forceDelete && existingFruit.amountInStorage > 0) {
        throw AppError.KnownError.create(
          FRUIT_STORAGE_ERRORS.CANNOT_DELETE_WITH_EXISTING_FRUIT,
        );
      }

      await this.fruitRepository.delete(name);
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
      const fruit = await this.fruitRepository.findByName(name);

      fruit.storeFruit(amount);
      await this.fruitRepository.update(fruit);

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
      const fruit = await this.fruitRepository.findByName(name);

      fruit.removeFruit(amount);
      await this.fruitRepository.update(fruit);

      return fruit;
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async findFruit(name: string): Promise<FruitStorage> {
    try {
      return this.fruitRepository.findByName(name);
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async listFruitStorages(): Promise<FruitStorage[]> {
    try {
      return this.fruitRepository.getAll();
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async deleteAllFruitsStorages(): Promise<void> {
    try {
      await this.fruitRepository.deleteAll();
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
