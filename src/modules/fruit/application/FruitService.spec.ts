import dotenv from "dotenv";
import { AppError } from "../../../common/core/error/AppError";
import outboxEventService from "../../../common/events/application/OutboxEventService";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../../../config/database";
import { FruitService } from "./FruitService";
import fruitRepository from "../infrastructure/FruitRepository";
import { FRUIT_EVENTS } from "../domain/constants/events.constant";

dotenv.config();

describe("FruitService", () => {
  let fruitService: FruitService;

  beforeAll(async () => {
    await connectToDatabase(process.env.MONGODB_URI_TEST || "");
    fruitService = new FruitService(fruitRepository, outboxEventService);
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    await fruitRepository.deleteAll();
    await outboxEventService.deleteAllEvents();
  });

  describe("createFruit", () => {
    it("should create and save a new fruit, then emit an event", async () => {
      await fruitService.createFruit("Apple", "Storage for apples", 100);

      const storedFruit = await fruitRepository.findByName("Apple");
      expect(storedFruit).toBeDefined();
      expect(storedFruit?.name).toBe("Apple");

      const events = await outboxEventService.findAllEvents();
      expect(events.some((event) => event.type === FRUIT_EVENTS.CREATE)).toBe(
        true,
      );
    });

    it("should throw an error if fruit with the same name exists", async () => {
      await fruitService.createFruit("Apple", "Storage for apples", 100);

      await expect(
        fruitService.createFruit("Apple", "Another storage for apples", 50),
      ).rejects.toThrow(AppError.KnownError);

      const fruitStorages = await fruitRepository.getAll();
      expect(fruitStorages.length).toBe(1);
    });
  });

  describe("updateFruit", () => {
    it("should update the fruit and emit an update event", async () => {
      await fruitService.createFruit("Apple", "Initial description", 50);
      const updatedFruit = await fruitService.updateFruit(
        "Apple",
        "Updated description",
        80,
      );

      expect(updatedFruit.description).toBe("Updated description");
      expect(updatedFruit.limitOfFruitToBeStored).toBe(80);

      const events = await outboxEventService.findAllEvents();
      expect(events.some((event) => event.type === FRUIT_EVENTS.UPDATE)).toBe(
        true,
      );
    });
  });

  describe("deleteFruit", () => {
    it("should delete the fruit", async () => {
      await fruitService.createFruit("Apple", "Description", 100);
      await fruitService.deleteFruit("Apple");

      await expect(fruitRepository.findByName("Apple")).rejects.toThrow(
        AppError.KnownError,
      );
    });
  });

  describe("findFruit", () => {
    it("should return the fruit if it exists", async () => {
      const fruit = await fruitService.createFruit("Apple", "Description", 100);
      const foundFruit = await fruitService.findFruit("Apple");

      expect(foundFruit.name).toBe(fruit.name);
    });
  });

  describe("listFruits", () => {
    it("should return all fruits", async () => {
      await fruitService.createFruit("Apple", "Description", 100);
      await fruitService.createFruit("Banana", "Storage for bananas", 50);

      const fruits = await fruitService.listFruits();
      expect(fruits.length).toBe(2);
    });
  });

  describe("deleteAllFruits", () => {
    it("should delete all fruits", async () => {
      await fruitService.createFruit("Apple", "Description", 100);
      await fruitService.deleteAllFruits();

      const allFruits = await fruitRepository.getAll();
      expect(allFruits.length).toBe(0);
    });
  });
});
