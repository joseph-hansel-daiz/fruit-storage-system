import { AppError } from "../../../../common/core/error/AppError";
import { FRUIT_ERRORS } from "../constants/errors.constant";

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
      throw AppError.KnownError.create(
        FRUIT_ERRORS.DESCRIPTION_CANNOT_EXCEED_LIMIT,
      );
    }
    return new FruitDescription(description);
  }
}
