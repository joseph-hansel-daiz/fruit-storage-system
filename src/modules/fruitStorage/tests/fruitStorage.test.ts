import outboxEventService from "../../../common/events/application/OutboxEventService";
import { executeScript } from "../../../common/tests/testConfig";
import fruitStorageService from "../application/FruitStorageService";
import { FRUIT_STORAGE_ERRORS } from "../domain/errors";
import { FRUIT_STORAGE_EVENTS } from "../domain/events";

afterEach(async () => {
  await fruitStorageService.deleteAllFruitsStorages();
  await outboxEventService.deleteAllEvents();
});

describe("createFruitForFruitStorage", () => {
  it("should create a fruit and produce a domain event", async () => {
    const result = await executeScript(`
            mutation {
                createFruitForFruitStorage(name: "lemon", description: "this is a lemon", limitOfFruitToBeStored: 10) {
                name
                description
                }
            }
        `);

    const existingEvents = await outboxEventService.findAllEvents();
    expect(existingEvents[existingEvents.length - 1].type).toBe(
      FRUIT_STORAGE_EVENTS.CREATE,
    );

    expect(result.data?.createFruitForFruitStorage?.name).toBe("lemon");
    expect(result.data?.createFruitForFruitStorage?.description).toBe(
      "this is a lemon",
    );
  });

  it("should fail when description is too long", async () => {
    const result = await executeScript(`
            mutation {
                createFruitForFruitStorage(name: "lemon", description: "this is a fruit with a very long description", limitOfFruitToBeStored: 10) {
                name
                }
            }
        `);

    expect(result.errors).toBeDefined();
    if (result.errors) {
      expect(result.errors[0].message).toBe(
        FRUIT_STORAGE_ERRORS.DESCRIPTION_CANNOT_EXCEED_LIMIT,
      );
    }
  });

  it("should fail when creating the same fruit twice", async () => {
    await executeScript(`
      mutation {
        createFruitForFruitStorage(name: "lemon", description: "this is a lemon", limitOfFruitToBeStored: 10) {
          name
        }
      }
    `);

    const duplicateResult = await executeScript(`
      mutation {
        createFruitForFruitStorage(name: "lemon", description: "this is a lemon", limitOfFruitToBeStored: 10) {
          name
        }
      }
    `);

    expect(duplicateResult.errors).toBeDefined();
    if (duplicateResult.errors) {
      expect(duplicateResult.errors[0].message).toBe(
        FRUIT_STORAGE_ERRORS.CANNOT_CREATE_EXISTING_FRUIT,
      );
    }
  });
});

describe("updateFruitForFruitStorage", () => {
  beforeEach(async () => {
    await fruitStorageService.createFruitStorage(
      "lemon",
      "this is a lemon",
      10,
    );
  });

  it("should update the description of an existing fruit and produce a domain event", async () => {
    const result = await executeScript(`
      mutation {
        updateFruitForFruitStorage(name: "lemon", description: "updated lemon description", limitOfFruitToBeStored: 10) {
          name
          description
        }
      }
    `);

    const existingEvents = await outboxEventService.findAllEvents();
    expect(existingEvents[existingEvents.length - 1].type).toBe(
      FRUIT_STORAGE_EVENTS.UPDATE,
    );

    expect(result.data?.updateFruitForFruitStorage.description).toBe(
      "updated lemon description",
    );
  });

  it("should fail if description is too long", async () => {
    const result = await executeScript(`
      mutation {
        updateFruitForFruitStorage(name: "lemon", description: "updated lemon with a long description", limitOfFruitToBeStored: 10) {
          name
        }
      }
    `);

    expect(result.errors).toBeDefined();
    if (result.errors) {
      expect(result.errors[0].message).toBe(
        FRUIT_STORAGE_ERRORS.DESCRIPTION_CANNOT_EXCEED_LIMIT,
      );
    }
  });
});

describe("deleteFruitFromFruitStorage", () => {
  beforeEach(async () => {
    await fruitStorageService.createFruitStorage(
      "lemon",
      "this is a lemon",
      10,
    );
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
    await fruitStorageService.createFruitStorage(
      "lemon",
      "this is a lemon",
      10,
    );
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
    await fruitStorageService.createFruitStorage(
      "lemon",
      "this is a lemon",
      10,
    );
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

describe("findFruit", () => {
  beforeEach(async () => {
    await fruitStorageService.createFruitStorage(
      "lemon",
      "this is a lemon",
      10,
    );
  });

  it("should find and return the lemon object", async () => {
    const result = await executeScript(`
      query {
        findFruit(name: "lemon") {
          name
          description
        }
      }
    `);

    expect(result.data?.findFruit.name).toBe("lemon");
  });

  it("should throw an error if fruit is not found", async () => {
    const result = await executeScript(`
      query {
        findFruit(name: "not a lemon") {
          name
        }
      }
    `);

    expect(result.errors).toBeDefined();
    if (result.errors) {
      expect(result.errors[0].message).toBe(FRUIT_STORAGE_ERRORS.CANNOT_READ);
    }
  });
});
