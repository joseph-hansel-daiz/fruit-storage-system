import { FRUIT_STORAGE_ERRORS } from "../constants/errors.constant";
import { FruitStorage } from "./FruitStorage";

describe("FruitStorage", () => {
  const validName = "Apple";
  const validDescription = "Fresh and juicy apples";
  const initialLimit = 100;

  describe("create", () => {
    it("should create a new FruitStorage instance with valid inputs", () => {
      const fruitStorage = FruitStorage.create(validName, initialLimit);
      expect(fruitStorage.name).toBe(validName);
      expect(fruitStorage.limitOfFruitToBeStored).toBe(initialLimit);
      expect(fruitStorage.amountInStorage).toBe(0);
    });
  });

  describe("storeFruit", () => {
    it("should add the specified amount of fruit to storage", () => {
      const fruitStorage = FruitStorage.create(validName, initialLimit);
      fruitStorage.storeFruit(20);
      expect(fruitStorage.amountInStorage).toBe(20);
    });

    it("should throw an error if the amount is not positive", () => {
      const fruitStorage = FruitStorage.create(validName, initialLimit);
      expect(() => fruitStorage.storeFruit(-5)).toThrow(
        FRUIT_STORAGE_ERRORS.AMOUNT_SHOULD_POSITIVE,
      );
    });

    it("should throw an error if the amount exceeds storage limit", () => {
      const fruitStorage = FruitStorage.create(validName, initialLimit, 90);
      expect(() => fruitStorage.storeFruit(20)).toThrow(
        FRUIT_STORAGE_ERRORS.CANNOT_STORE,
      );
    });
  });

  describe("removeFruit", () => {
    it("should remove the specified amount of fruit from storage", () => {
      const fruitStorage = FruitStorage.create(validName, initialLimit, 50);
      fruitStorage.removeFruit(20);
      expect(fruitStorage.amountInStorage).toBe(30);
    });

    it("should throw an error if the amount is not positive", () => {
      const fruitStorage = FruitStorage.create(validName, initialLimit);
      expect(() => fruitStorage.removeFruit(-5)).toThrow(
        FRUIT_STORAGE_ERRORS.AMOUNT_SHOULD_POSITIVE,
      );
    });

    it("should throw an error if there is insufficient fruit to remove", () => {
      const fruitStorage = FruitStorage.create(validName, initialLimit, 10);
      expect(() => fruitStorage.removeFruit(20)).toThrow(
        FRUIT_STORAGE_ERRORS.CANNOT_REMOVE,
      );
    });
  });

  describe("updateLimitOfFruitToBeStored", () => {
    it("should update the storage limit", () => {
      const fruitStorage = FruitStorage.create(validName, initialLimit);
      const newLimit = 200;
      fruitStorage.updateLimitOfFruitToBeStored(newLimit);
      expect(fruitStorage.limitOfFruitToBeStored).toBe(newLimit);
    });
  });
});
