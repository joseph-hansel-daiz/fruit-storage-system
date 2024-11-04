import { FRUIT_STORAGE_ERRORS } from "../constants/errors";

export class FruitDescription {
  private readonly _value: string;

  private constructor(description: string) {
    this._value = description;
  }

  public get value(): string {
    return this._value;
  }

  public static create(description: string): FruitDescription {
    if (description.length > 30) {
      throw new Error(FRUIT_STORAGE_ERRORS.DESCRIPTION_CANNOT_EXCEED_LIMIT);
    }
    return new FruitDescription(description);
  }
}
