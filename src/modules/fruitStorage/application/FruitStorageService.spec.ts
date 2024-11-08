import dotenv from "dotenv";
import { AppError } from "../../../common/core/error/AppError";
import outboxEventService from "../../../common/events/application/OutboxEventService";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../../../config/database";
import { FRUIT_STORAGE_EVENTS } from "../domain/constants/events.constant";
import fruitStorageRepository from "../infrastructure/FruitStorageRepository";
import { FruitStorageService } from "./FruitStorageService";

dotenv.config();

describe("FruitStorageService", () => {
  let fruitStorageService: FruitStorageService;

  beforeAll(async () => {
    await connectToDatabase(process.env.MONGODB_URI_TEST || "");
    fruitStorageService = new FruitStorageService(
      fruitStorageRepository,
      outboxEventService,
    );
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    await fruitStorageRepository.deleteAll();
    await outboxEventService.deleteAllEvents();
  });

  afterEach(async () => {
    await fruitStorageRepository.deleteAll();
    await outboxEventService.deleteAllEvents();
  });

  describe("createFruitStorage", () => {
    it("should create and save a new fruit storage", async () => {
      await fruitStorageService.createFruitStorage("Apple", 100);

      const storedFruit = await fruitStorageRepository.findByName("Apple");
      expect(storedFruit).toBeDefined();
      expect(storedFruit?.name).toBe("Apple");
    });

    it("should throw an error if fruit storage with the same name exists", async () => {
      await fruitStorageService.createFruitStorage("Apple", 100);

      await expect(
        fruitStorageService.createFruitStorage("Apple", 50),
      ).rejects.toThrow(AppError.KnownError);

      const fruitStorages = await fruitStorageRepository.getAll();
      expect(fruitStorages.length).toBe(1);
    });
  });

  describe("updateFruitStorage", () => {
    it("should update the fruit storage", async () => {
      await fruitStorageService.createFruitStorage("Apple", 50);
      const updatedFruit = await fruitStorageService.updateFruitStorage(
        "Apple",
        80,
      );

      expect(updatedFruit.limitOfFruitToBeStored).toBe(80);
    });
  });

  describe("deleteFruitStorage", () => {
    it("should delete the fruit storage if forceDelete is true, and emit a domain event", async () => {
      await fruitStorageService.createFruitStorage("Apple", 100);
      await fruitStorageService.deleteFruitStorage("Apple", true);

      await expect(fruitStorageRepository.findByName("Apple")).rejects.toThrow(
        AppError.KnownError,
      );

      const events = await outboxEventService.findAllEvents();
      expect(
        events.some((event) => event.type === FRUIT_STORAGE_EVENTS.DELETE),
      ).toBe(true);
    });

    it("should throw an error if deleting without forceDelete and amountInStorage > 0", async () => {
      const fruit = await fruitStorageService.createFruitStorage("Apple", 100);
      fruit.storeFruit(10);
      await fruitStorageRepository.update(fruit);

      await expect(
        fruitStorageService.deleteFruitStorage("Apple"),
      ).rejects.toThrow(AppError.KnownError);
    });
  });

  describe("storeFruit", () => {
    it("should increase the amount of stored fruit", async () => {
      await fruitStorageService.createFruitStorage("Apple", 100);
      const updatedFruit = await fruitStorageService.storeFruit("Apple", 20);

      expect(updatedFruit.amountInStorage).toBe(20);

      const storedFruit = await fruitStorageRepository.findByName("Apple");
      expect(storedFruit?.amountInStorage).toBe(20);
    });
  });

  describe("removeFruit", () => {
    it("should decrease the amount of stored fruit", async () => {
      const fruit = await fruitStorageService.createFruitStorage("Apple", 100);
      fruit.storeFruit(50);
      await fruitStorageRepository.update(fruit);

      const updatedFruit = await fruitStorageService.removeFruit("Apple", 20);
      expect(updatedFruit.amountInStorage).toBe(30);
    });
  });

  describe("findFruit", () => {
    it("should return the fruit storage if it exists", async () => {
      const fruit = await fruitStorageService.createFruitStorage("Apple", 100);
      const foundFruit = await fruitStorageService.findFruitStorage("Apple");

      expect(foundFruit.name).toBe(fruit.name);
    });
  });

  describe("listFruitStorages", () => {
    it("should return all fruit storages", async () => {
      await fruitStorageService.createFruitStorage("Apple", 100);
      await fruitStorageService.createFruitStorage("Banana", 50);

      const fruits = await fruitStorageService.listFruitStorages();
      expect(fruits.length).toBe(2);
    });
  });

  describe("deleteAllFruitsStorages", () => {
    it("should delete all fruit storages", async () => {
      await fruitStorageService.createFruitStorage("Apple", 100);
      await fruitStorageService.deleteAllFruitsStorages();

      const allFruits = await fruitStorageRepository.getAll();
      expect(allFruits.length).toBe(0);
    });
  });
});
