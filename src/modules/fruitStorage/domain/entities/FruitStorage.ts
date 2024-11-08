import { AppError } from "../../../../common/core/error/AppError";
import { FRUIT_STORAGE_ERRORS } from "../constants/errors.constant";

export class FruitStorage {
  private _name: string;
  private _limitOfFruitToBeStored: number;
  private _amountInStorage: number;

  private constructor(
    name: string,
    limitOfFruitToBeStored: number,
    amountInStorage: number,
  ) {
    this._name = name;
    this._limitOfFruitToBeStored = limitOfFruitToBeStored;
    this._amountInStorage = amountInStorage;
  }

  public get name(): string {
    return this._name;
  }

  public get limitOfFruitToBeStored() {
    return this._limitOfFruitToBeStored;
  }

  public get amountInStorage() {
    return this._amountInStorage;
  }

  public storeFruit(amount: number): void {
    if (amount <= 0) {
      throw AppError.KnownError.create(
        FRUIT_STORAGE_ERRORS.AMOUNT_SHOULD_POSITIVE,
      );
    }
    if (this._amountInStorage + amount > this._limitOfFruitToBeStored) {
      throw AppError.KnownError.create(FRUIT_STORAGE_ERRORS.CANNOT_STORE);
    }
    this._amountInStorage += amount;
  }

  public removeFruit(amount: number): void {
    if (amount <= 0) {
      throw AppError.KnownError.create(
        FRUIT_STORAGE_ERRORS.AMOUNT_SHOULD_POSITIVE,
      );
    }
    if (this._amountInStorage < amount) {
      throw AppError.KnownError.create(FRUIT_STORAGE_ERRORS.CANNOT_REMOVE);
    }
    this._amountInStorage -= amount;
  }

  public updateLimitOfFruitToBeStored(limitOfFruitToBeStored: number): void {
    this._limitOfFruitToBeStored = limitOfFruitToBeStored;
  }

  public static create(
    name: string,
    limitOfFruitToBeStored: number,
    amountInStorage: number = 0,
  ): FruitStorage {
    return new FruitStorage(name, limitOfFruitToBeStored, amountInStorage);
  }
}
