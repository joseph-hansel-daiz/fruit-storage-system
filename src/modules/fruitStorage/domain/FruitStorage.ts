import { FRUIT_STORAGE_ERRORS } from "./errors";
import { FruitDescription } from "./FruitDescription";
import { FruitName } from "./FruitName";

export class FruitStorage {
  private _name: FruitName;
  private _description: FruitDescription;
  private _limitOfFruitToBeStored: number;
  private _amountInStorage: number;

  private constructor(
    name: FruitName,
    description: FruitDescription,
    limitOfFruitToBeStored: number,
    amountInStorage: number,
  ) {
    this._name = name;
    this._description = description;
    this._limitOfFruitToBeStored = limitOfFruitToBeStored;
    this._amountInStorage = amountInStorage;
  }

  public get name(): string {
    return this._name.value;
  }

  public get description() {
    return this._description.value;
  }

  public get limitOfFruitToBeStored() {
    return this._limitOfFruitToBeStored;
  }

  public get amountInStorage() {
    return this._amountInStorage;
  }

  public storeFruit(amount: number): void {
    if (amount <= 0) {
      throw new Error(FRUIT_STORAGE_ERRORS.AMOUNT_SHOULD_POSITIVE);
    }
    if (this._amountInStorage + amount > this._limitOfFruitToBeStored) {
      throw new Error(FRUIT_STORAGE_ERRORS.CANNOT_STORE);
    }
    this._amountInStorage += amount;
  }

  public removeFruit(amount: number): void {
    if (amount <= 0) {
      throw new Error(FRUIT_STORAGE_ERRORS.AMOUNT_SHOULD_POSITIVE);
    }
    if (this._amountInStorage < amount) {
      throw new Error(FRUIT_STORAGE_ERRORS.CANNOT_REMOVE);
    }
    this._amountInStorage -= amount;
  }

  public updateDescription(description: string): void {
    this._description = FruitDescription.create(description);
  }

  public updateLimitOfFruitToBeStored(limitOfFruitToBeStored: number): void {
    this._limitOfFruitToBeStored = limitOfFruitToBeStored;
  }

  public static create(
    name: string,
    description: string,
    limitOfFruitToBeStored: number,
    amountInStorage: number = 0,
  ): FruitStorage {
    const fruitName = FruitName.create(name);
    const fruitDescription = FruitDescription.create(description);
    return new FruitStorage(
      fruitName,
      fruitDescription,
      limitOfFruitToBeStored,
      amountInStorage,
    );
  }
}
