import outboxEventService from "../../../common/events/application/OutboxEventService";
import { executeScript } from "../../../common/tests/testConfig";
import fruitStorageService from "../application/FruitStorageService";
import { FRUIT_STORAGE_ERRORS } from "../domain/constants/errors.constant";
import { FRUIT_STORAGE_EVENTS } from "../domain/constants/events.constant";

afterEach(async () => {
  await fruitStorageService.deleteAllFruitsStorages();
  await outboxEventService.deleteAllEvents();
});

describe("deleteFruitFromFruitStorage", () => {
  beforeEach(async () => {
    await fruitStorageService.createFruitStorage("lemon", 10);
    await fruitStorageService.storeFruit("lemon", 5);
  });

  it("should fail if fruit is in storage and `forceDelete` is false", async () => {
    const result = await executeScript(`
      mutation {
        deleteFruitFromFruitStorage(name: "lemon", forceDelete: false)
      }
    `);

    expect(result.errors).toBeDefined();
    if (result.errors) {
      expect(result.errors[0].message).toBe(
        FRUIT_STORAGE_ERRORS.CANNOT_DELETE_WITH_EXISTING_FRUIT,
      );
    }
  });

  it("should delete fruit and produce a domain event when `forceDelete` is true", async () => {
    const result = await executeScript(`
      mutation {
        deleteFruitFromFruitStorage(name: "lemon", forceDelete: true)
      }
    `);

    const existingEvents = await outboxEventService.findAllEvents();
    expect(existingEvents[existingEvents.length - 1].type).toBe(
      FRUIT_STORAGE_EVENTS.DELETE,
    );

    expect(result.data?.deleteFruitFromFruitStorage).toBe(true);
  });
});

describe("storeFruitToFruitStorage", () => {
  beforeEach(async () => {
    await fruitStorageService.createFruitStorage("lemon", 10);
  });

  it("should store fruit below the storage limit", async () => {
    const result = await executeScript(`
      mutation {
        storeFruitToFruitStorage(name: "lemon", amount: 5) {
          name
          amountInStorage
        }
      }
    `);

    expect(result.data?.storeFruitToFruitStorage.amountInStorage).toBe(5);
  });

  it("should fail if storing above the storage limit", async () => {
    const result = await executeScript(`
      mutation {
        storeFruitToFruitStorage(name: "lemon", amount: 11) {
          name
          amountInStorage
        }
      }
    `);

    expect(result.errors).toBeDefined();
    if (result.errors) {
      expect(result.errors[0].message).toBe(FRUIT_STORAGE_ERRORS.CANNOT_STORE);
    }
  });
});

describe("removeFruitFromFruitStorage", () => {
  beforeEach(async () => {
    await fruitStorageService.createFruitStorage("lemon", 10);
    await fruitStorageService.storeFruit("lemon", 5);
  });
  it("should remove exact amount of fruit in storage", async () => {
    const result = await executeScript(`
      mutation {
        removeFruitFromFruitStorage(name: "lemon", amount: 5) {
          name
          amountInStorage
        }
      }
    `);

    expect(result.data?.removeFruitFromFruitStorage.amountInStorage).toBe(0);
  });

  it("should fail if removing more than available in storage", async () => {
    const result = await executeScript(`
      mutation {
        removeFruitFromFruitStorage(name: "lemon", amount: 6) {
          name
          amountInStorage
        }
      }
    `);

    expect(result.errors).toBeDefined();
    if (result.errors) {
      expect(result.errors[0].message).toBe(FRUIT_STORAGE_ERRORS.CANNOT_REMOVE);
    }
  });
});
