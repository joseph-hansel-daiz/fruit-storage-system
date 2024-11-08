import { FRUIT_ERRORS } from "../constants/errors.constant";
import { FruitDescription } from "./FruitDescription";

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
        FRUIT_ERRORS.DESCRIPTION_CANNOT_EXCEED_LIMIT,
      );
    });
  });
});
