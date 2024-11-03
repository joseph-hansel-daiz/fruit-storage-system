import { mutationType, stringArg, intArg, booleanArg, nonNull } from "nexus";
import fruitStorageService from "../../application/FruitStorageService";

export const FruitStorageMutation = mutationType({
  definition(t) {
    t.field("createFruitForFruitStorage", {
      type: "FruitStorage",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        limitOfFruitToBeStored: nonNull(intArg()),
      },
      resolve: async (_, { name, description, limitOfFruitToBeStored }) => {
        return fruitStorageService.createFruitStorage(
          name,
          description,
          limitOfFruitToBeStored,
        );
      },
    });

    t.field("updateFruitForFruitStorage", {
      type: "FruitStorage",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        limitOfFruitToBeStored: nonNull(intArg()),
      },
      resolve: async (_, { name, description, limitOfFruitToBeStored }) => {
        return fruitStorageService.updateFruitStorage(
          name,
          description,
          limitOfFruitToBeStored,
        );
      },
    });

    t.field("deleteFruitFromFruitStorage", {
      type: "Boolean",
      args: {
        name: nonNull(stringArg()),
        forceDelete: nonNull(booleanArg()),
      },
      resolve: async (_, { name, forceDelete }) => {
        await fruitStorageService.deleteFruitStorage(name, forceDelete);
        return true;
      },
    });

    t.field("storeFruitToFruitStorage", {
      type: "FruitStorage",
      args: {
        name: nonNull(stringArg()),
        amount: nonNull(intArg()),
      },
      resolve: async (_, { name, amount }) => {
        return fruitStorageService.storeFruit(name, amount);
      },
    });

    t.field("removeFruitFromFruitStorage", {
      type: "FruitStorage",
      args: {
        name: nonNull(stringArg()),
        amount: nonNull(intArg()),
      },
      resolve: async (_, { name, amount }) => {
        return await fruitStorageService.removeFruit(name, amount);
      },
    });
  },
});
