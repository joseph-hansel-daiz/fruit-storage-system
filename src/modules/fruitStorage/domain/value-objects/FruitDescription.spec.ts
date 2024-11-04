import { FruitDescription } from "./FruitDescription";
import { FRUIT_STORAGE_ERRORS } from "../constants/errors.constant";

describe("FruitDescription", () => {
  describe("create", () => {
    it("should create a FruitDescription instance when the description is within the character limit", () => {
      const description = "A short and valid description";
      const fruitDescription = FruitDescription.create(description);
      expect(fruitDescription.value).toBe(description);
    });

    it("should throw an error if the description exceeds the character limit", () => {
      const longDescription =
        "This description is way too long and exceeds the 30 character limit.";
      expect(() => FruitDescription.create(longDescription)).toThrow(
        FRUIT_STORAGE_ERRORS.DESCRIPTION_CANNOT_EXCEED_LIMIT,
      );
    });
  });
});
