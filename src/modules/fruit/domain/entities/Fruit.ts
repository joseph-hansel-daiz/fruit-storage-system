import { FruitDescription } from "../value-objects/FruitDescription";
import { FruitName } from "../value-objects/FruitName";

export class Fruit {
  private _name: FruitName;
  private _description: FruitDescription;
  private _limitOfFruitToBeStored: number;

  private constructor(
    name: FruitName,
    description: FruitDescription,
    limitOfFruitToBeStored: number,
  ) {
    this._name = name;
    this._description = description;
    this._limitOfFruitToBeStored = limitOfFruitToBeStored;
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
  ): Fruit {
    const fruitName = FruitName.create(name);
    const fruitDescription = FruitDescription.create(description);
    return new Fruit(fruitName, fruitDescription, limitOfFruitToBeStored);
  }
}
