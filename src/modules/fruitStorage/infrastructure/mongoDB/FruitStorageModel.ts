import { Document, model, Model, Schema } from "mongoose";

export interface IFruitStorageDocument extends Document {
  name: string;
  description: string;
  limitOfFruitToBeStored: number;
  amountInStorage: number;
}

const fruitStorageSchema = new Schema({
  name: { type: String, required: true, unique: true },
  limitOfFruitToBeStored: { type: Number, required: true },
  amountInStorage: { type: Number, required: true, default: 0 },
});

const FruitStorageModel: Model<IFruitStorageDocument> =
  model<IFruitStorageDocument>("FruitStorage", fruitStorageSchema);

export default FruitStorageModel;
