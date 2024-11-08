import { Fruit } from "./Fruit";

describe("Fruit", () => {
  const validName = "Apple";
  const validDescription = "Fresh and juicy apples";
  const initialLimit = 100;

  describe("create", () => {
    it("should create a new Fruit instance with valid inputs", () => {
      const fruitStorage = Fruit.create(
        validName,
        validDescription,
        initialLimit,
      );
      expect(fruitStorage.name).toBe(validName);
      expect(fruitStorage.description).toBe(validDescription);
      expect(fruitStorage.limitOfFruitToBeStored).toBe(initialLimit);
    });
  });

  describe("updateDescription", () => {
    it("should update the description of the fruit storage", () => {
      const fruitStorage = Fruit.create(
        validName,
        validDescription,
        initialLimit,
      );
      const newDescription = "Ripe apples ready for sale";
      fruitStorage.updateDescription(newDescription);
      expect(fruitStorage.description).toBe(newDescription);
    });
  });

  describe("updateLimitOfFruitToBeStored", () => {
    it("should update the storage limit", () => {
      const fruitStorage = Fruit.create(
        validName,
        validDescription,
        initialLimit,
      );
      const newLimit = 200;
      fruitStorage.updateLimitOfFruitToBeStored(newLimit);
      expect(fruitStorage.limitOfFruitToBeStored).toBe(newLimit);
    });
  });
});
