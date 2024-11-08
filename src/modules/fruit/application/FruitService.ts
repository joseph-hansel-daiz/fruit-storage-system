import { AppError } from "../../../common/core/error/AppError";
import outboxEventService, {
  OutboxEventService,
} from "../../../common/events/application/OutboxEventService";
import { IFruitRepository } from "../adapter/IFruitRepository";
import { FRUIT_STORAGE_ERRORS } from "../domain/constants/errors.constant";
import { FRUIT_EVENTS } from "../domain/constants/events.constant";
import { Fruit } from "../domain/entities/Fruit";
import FruitMap from "../infrastructure/FruitMapper";
import fruitRepository from "../infrastructure/FruitRepository";

export class FruitService {
  constructor(
    private fruitRepository: IFruitRepository,
    private outboxEventService: OutboxEventService,
  ) {}

  public async createFruit(
    name: string,
    description: string,
    limitOfFruitToBeStored: number,
  ): Promise<Fruit> {
    try {
      const isExistingFruit = await this.fruitRepository.exists(name);
      if (isExistingFruit) {
        throw AppError.KnownError.create(
          FRUIT_STORAGE_ERRORS.CANNOT_CREATE_EXISTING_FRUIT,
        );
      }

      const fruit = Fruit.create(name, description, limitOfFruitToBeStored);
      await this.fruitRepository.save(fruit);

      await this.outboxEventService.createEvent(
        FRUIT_EVENTS.CREATE,
        FruitMap.toDTO(fruit),
      );

      return fruit;
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async updateFruit(
    name: string,
    description: string,
    limitOfFruitToBeStored: number,
  ): Promise<Fruit> {
    try {
      const existingFruit = await this.fruitRepository.findByName(name);

      existingFruit.updateDescription(description);
      existingFruit.updateLimitOfFruitToBeStored(limitOfFruitToBeStored);

      await this.fruitRepository.update(existingFruit);

      await this.outboxEventService.createEvent(
        FRUIT_EVENTS.UPDATE,
        FruitMap.toDTO(existingFruit),
      );

      return existingFruit;
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async deleteFruit(name: string): Promise<void> {
    try {
      const existingFruit = await this.fruitRepository.findByName(name);

      await this.fruitRepository.delete(name);
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async findFruit(name: string): Promise<Fruit> {
    try {
      return this.fruitRepository.findByName(name);
    } catch (error) {
      throw AppError.identifyError(error);
    }
  }

  public async listFruits(): Promise<Fruit[]> {
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

const fruitService = new FruitService(fruitRepository, outboxEventService);

export default fruitService;
