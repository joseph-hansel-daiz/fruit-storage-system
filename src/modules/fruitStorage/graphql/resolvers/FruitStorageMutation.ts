import { booleanArg, extendType, intArg, nonNull, stringArg } from "nexus";
import fruitStorageService from "../../application/FruitStorageService";

export const FruitStorageMutation = extendType({
  type: "Mutation",
  definition(t) {
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
