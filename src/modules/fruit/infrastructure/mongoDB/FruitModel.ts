import { Document, model, Model, Schema } from "mongoose";

export interface IFruitDocument extends Document {
  name: string;
  description: string;
  limitOfFruitToBeStored: number;
}

const fruitSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  limitOfFruitToBeStored: { type: Number, required: true },
});

const FruitModel: Model<IFruitDocument> =
  model<IFruitDocument>("Fruit", fruitSchema);

export default FruitModel;
