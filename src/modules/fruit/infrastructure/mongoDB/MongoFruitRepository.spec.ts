import dotenv from "dotenv";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../../../../config/database";
import { FRUIT_ERRORS } from "../../domain/constants/errors.constant";
import { Fruit } from "../../domain/entities/Fruit";
import FruitMap from "../FruitMapper";
import FruitModel from "./FruitModel";
import { MongoFruitRepository } from "./MongoFruitRepository";

dotenv.config();

describe("MongoFruitRepository Unit Tests", () => {
  let fruitStorageRepository: MongoFruitRepository;
  let fruitStorage: Fruit;

  const fruitStorageData = {
    name: "Apple",
    description: "A description an apple",
    limitOfFruitToBeStored: 10,
    amountInStorage: 5,
  };

  const otherFruitStorageData = {
    name: "Orange",
    description: "A description of an orange",
    limitOfFruitToBeStored: 10,
    amountInStorage: 5,
  };

  beforeAll(async () => {
    await connectToDatabase(process.env.MONGODB_URI_TEST || "");
    fruitStorageRepository = new MongoFruitRepository();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    fruitStorage = Fruit.create(
      fruitStorageData.name,
      fruitStorageData.description,
      fruitStorageData.limitOfFruitToBeStored,
    );
  });

  afterEach(async () => {
    await FruitModel.deleteMany({});
  });

  describe("findByName", () => {
    it("should return a Fruit instance when the fruit is found", async () => {
      const fruit = FruitMap.ToMongoDocument(fruitStorage);
      await fruit.save();

      const result = await fruitStorageRepository.findByName(
        fruitStorageData.name,
      );

      expect(result.name).toBe(fruitStorageData.name);
      expect(result.description).toBe(fruitStorageData.description);
    });

    it("should throw an error if the fruit is not found", async () => {
      await expect(
        fruitStorageRepository.findByName(otherFruitStorageData.name),
      ).rejects.toThrow(FRUIT_ERRORS.CANNOT_READ);
    });
  });

  describe("save", () => {
    it("should save a new Fruit document", async () => {
      await fruitStorageRepository.save(fruitStorage);

      const savedFruit = await FruitModel.findOne({
        name: fruitStorage.name,
      });
      expect(savedFruit).not.toBeNull();
      expect(savedFruit?.name).toBe(fruitStorageData.name);
      expect(savedFruit?.description).toBe(fruitStorageData.description);
    });
  });

  describe("update", () => {
    it("should update and return the updated Fruit", async () => {
      const fruit = FruitMap.ToMongoDocument(fruitStorage);
      await fruit.save();

      fruitStorage.updateDescription(otherFruitStorageData.description);

      await fruitStorageRepository.update(fruitStorage);

      const updatedFruitDocument = await FruitModel.findOne({
        name: fruitStorageData.name,
      });
      expect(updatedFruitDocument?.description).toBe(
        otherFruitStorageData.description,
      );
    });
  });

  describe("delete", () => {
    it("should delete a fruit by name", async () => {
      const fruit = FruitMap.ToMongoDocument(fruitStorage);
      await fruit.save();

      expect(
        await FruitModel.findOne({
          name: fruitStorageData.name,
        }),
      ).not.toBeNull();

      await fruitStorageRepository.delete(fruitStorageData.name);

      expect(
        await FruitModel.findOne({
          name: fruitStorageData.name,
        }),
      ).toBeNull();
    });
  });

  describe("getAll", () => {
    it("should return an array of Fruit instances", async () => {
      await FruitModel.insertMany([fruitStorageData, otherFruitStorageData]);

      const result = await fruitStorageRepository.getAll();

      expect(result.length).toBe(2);
      expect(result[0].name).toBe(fruitStorageData.name);
      expect(result[1].name).toBe(otherFruitStorageData.name);
    });
  });

  describe("deleteAll", () => {
    it("should delete all fruits", async () => {
      await FruitModel.insertMany([fruitStorageData, otherFruitStorageData]);
      expect((await FruitModel.find()).length).toBe(2);

      await fruitStorageRepository.deleteAll();
      expect((await FruitModel.find()).length).toBe(0);
    });
  });
});
