import { Document, model, Model, Schema } from 'mongoose';

export interface IFruitStorageDocument extends Document {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
    amountInStorage: number;
}

const fruitSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    limitOfFruitToBeStored: { type: Number, required: true },
    amountInStorage: { type: Number, required: true, default: 0 },
});

const FruitStorageModel: Model<IFruitStorageDocument> = model<IFruitStorageDocument>('Fruit', fruitSchema);

export default FruitStorageModel;
