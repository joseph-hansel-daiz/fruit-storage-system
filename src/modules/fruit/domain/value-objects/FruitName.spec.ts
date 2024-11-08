import { FRUIT_STORAGE_ERRORS } from "../constants/errors.constant";
import { FruitName } from "./FruitName";

describe("FruitName", () => {
  describe("create", () => {
    it("should create a FruitName instance when the name is valid", () => {
      const name = "Apple";
      const fruitName = FruitName.create(name);
      expect(fruitName.value).toBe(name);
    });

    it("should throw an error if the name is an empty string", () => {
      const emptyName = "";
      expect(() => FruitName.create(emptyName)).toThrow(
        FRUIT_STORAGE_ERRORS.NAME_CANNOT_BE_EMPTY,
      );
    });

    it("should throw an error if the name is only whitespace", () => {
      const whitespaceName = "   ";
      expect(() => FruitName.create(whitespaceName)).toThrow(
        FRUIT_STORAGE_ERRORS.NAME_CANNOT_BE_EMPTY,
      );
    });
  });
});
