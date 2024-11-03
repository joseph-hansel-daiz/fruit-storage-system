import { IFruitStorageRepository } from "../adapter/IFruitStorageRepository";
import { FRUIT_STORAGE_ERRORS } from "../domain/errors";
import { FruitStorage } from "../domain/FruitStorage";
import fruitStorageRepository from "../infrastructure/FruitStorageRepository";

export class FruitStorageService {
    constructor(private fruitRepository: IFruitStorageRepository) { }

    public async createFruitStorage(name: string, description: string, limitOfFruitToBeStored: number): Promise<FruitStorage> {
        const fruit = FruitStorage.create(name, description, limitOfFruitToBeStored);
        await this.fruitRepository.save(fruit);
        return fruit;
    }

    public async updateFruitStorage(name: string, description: string, limitOfFruitToBeStored: number): Promise<FruitStorage> {
        const existingFruit = await this.fruitRepository.findByName(name);

        existingFruit.updateDescription(description);
        existingFruit.updateLimitOfFruitToBeStored(limitOfFruitToBeStored);

        await this.fruitRepository.update(existingFruit);
        return existingFruit;
    }

    public async deleteFruitStorage(name: string, forceDelete: boolean = false): Promise<void> {
        const existingFruit = await this.fruitRepository.findByName(name);

        if (!forceDelete && existingFruit.amountInStorage > 0) {
            throw new Error(FRUIT_STORAGE_ERRORS.CANNOT_DELETE_WITH_EXISTING_FRUIT);
        }

        await this.fruitRepository.delete(name);
    }

    public async storeFruit(name: string, amount: number): Promise<FruitStorage> {
        const fruit = await this.fruitRepository.findByName(name);

        fruit.storeFruit(amount);
        await this.fruitRepository.update(fruit);
        return fruit;
    }

    public async removeFruit(name: string, amount: number): Promise<FruitStorage> {
        const fruit = await this.fruitRepository.findByName(name);

        fruit.removeFruit(amount);
        await this.fruitRepository.update(fruit);
        return fruit;
    }

    public async findFruitStorage(name: string): Promise<FruitStorage> {
        return this.fruitRepository.findByName(name);
    }

    public async listFruitStorages(): Promise<FruitStorage[]> {
        return this.fruitRepository.getAll();
    }

    public async deleteAllFruitsStorages(): Promise<void> {
        await this.fruitRepository.deleteAll();
    }
}

const fruitStorageService = new FruitStorageService(fruitStorageRepository);

export default fruitStorageService;
