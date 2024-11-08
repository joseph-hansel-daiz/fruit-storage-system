import dotenv from "dotenv";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../../../../config/database";
import { FRUIT_STORAGE_ERRORS } from "../../domain/constants/errors.constant";
import { FruitStorage } from "../../domain/entities/FruitStorage";
import FruitStorageMap from "../FruitStorageMapper";
import FruitStorageModel from "./FruitStorageModel";
import { MongoFruitStorageRepository } from "./MongoFruitStorageRepository";

dotenv.config();

describe("MongoFruitStorageRepository Unit Tests", () => {
  let fruitStorageRepository: MongoFruitStorageRepository;
  let fruitStorage: FruitStorage;

  const fruitStorageData = {
    name: "Apple",
    limitOfFruitToBeStored: 10,
    amountInStorage: 5,
  };

  const otherFruitStorageData = {
    name: "Orange",
    limitOfFruitToBeStored: 10,
    amountInStorage: 5,
  };

  beforeAll(async () => {
    await connectToDatabase(process.env.MONGODB_URI_TEST || "");
    fruitStorageRepository = new MongoFruitStorageRepository();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    fruitStorage = FruitStorage.create(
      fruitStorageData.name,
      fruitStorageData.limitOfFruitToBeStored,
      fruitStorageData.amountInStorage,
    );
    await FruitStorageModel.deleteMany({});
  });

  afterEach(async () => {
    await FruitStorageModel.deleteMany({});
  });

  describe("findByName", () => {
    it("should return a FruitStorage instance when the fruit is found", async () => {
      const fruit = FruitStorageMap.ToMongoDocument(fruitStorage);
      await fruit.save();

      const result = await fruitStorageRepository.findByName(
        fruitStorageData.name,
      );

      expect(result.name).toBe(fruitStorageData.name);
    });

    it("should throw an error if the fruit storage is not found", async () => {
      await expect(
        fruitStorageRepository.findByName(otherFruitStorageData.name),
      ).rejects.toThrow(FRUIT_STORAGE_ERRORS.CANNOT_READ);
    });
  });

  describe("save", () => {
    it("should save a new FruitStorage document", async () => {
      await fruitStorageRepository.save(fruitStorage);

      const savedFruit = await FruitStorageModel.findOne({
        name: fruitStorage.name,
      }).lean();
      expect(savedFruit).not.toBeNull();
      expect(savedFruit?.name).toBe(fruitStorageData.name);
    });
  });

  describe("update", () => {
    it("should update and return the updated FruitStorage", async () => {
      const fruit = FruitStorageMap.ToMongoDocument(fruitStorage);
      await fruit.save();

      fruitStorage.updateLimitOfFruitToBeStored(
        otherFruitStorageData.limitOfFruitToBeStored,
      );

      await fruitStorageRepository.update(fruitStorage);

      const updatedFruitDocument = await FruitStorageModel.findOne({
        name: fruitStorageData.name,
      }).lean();

      expect(updatedFruitDocument?.limitOfFruitToBeStored).toBe(
        otherFruitStorageData.limitOfFruitToBeStored,
      );
    });
  });

  describe("delete", () => {
    it("should delete a fruit storage by name", async () => {
      const fruit = FruitStorageMap.ToMongoDocument(fruitStorage);
      await fruit.save();

      expect(
        await FruitStorageModel.findOne({
          name: fruitStorageData.name,
        }).lean(),
      ).not.toBeNull();

      await fruitStorageRepository.delete(fruitStorageData.name);

      expect(
        await FruitStorageModel.findOne({
          name: fruitStorageData.name,
        }).lean(),
      ).toBeNull();
    });
  });

  describe("getAll", () => {
    it("should return an array of FruitStorage instances", async () => {
      await FruitStorageModel.insertMany([
        fruitStorageData,
        otherFruitStorageData,
      ]);

      const result = await fruitStorageRepository.getAll();

      expect(result.length).toBe(2);
      expect(result[0].name).toBe(fruitStorageData.name);
      expect(result[1].name).toBe(otherFruitStorageData.name);
    });
  });

  describe("deleteAll", () => {
    it("should delete all fruits storages in storage", async () => {
      await FruitStorageModel.insertMany([
        fruitStorageData,
        otherFruitStorageData,
      ]);
      expect((await FruitStorageModel.find().lean()).length).toBe(2);

      await fruitStorageRepository.deleteAll();
      expect((await FruitStorageModel.find().lean()).length).toBe(0);
    });
  });
});
