import { AppError } from "../../../../common/core/error/AppError";
import { FRUIT_STORAGE_ERRORS } from "../constants/errors.constant";

export class FruitName {
  private readonly _value: string;

  private constructor(name: string) {
    this._value = name;
  }

  public get value(): string {
    return this._value;
  }

  public static create(name: string): FruitName {
    if (!name || name.trim() === "") {
      throw AppError.KnownError.create(
        FRUIT_STORAGE_ERRORS.NAME_CANNOT_BE_EMPTY,
      );
    }
    return new FruitName(name);
  }
}
