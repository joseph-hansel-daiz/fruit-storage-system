import { extendType, list, nonNull, stringArg } from "nexus";
import fruitStorageService from "../../application/FruitStorageService";

export const FruitStorageQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("findFruitStorage", {
      type: "FruitStorage",
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_, { name }) => {
        return fruitStorageService.findFruitStorage(name);
      },
    });

    t.field("listFruitStorages", {
      type: list("FruitStorage"),
      resolve: async () => {
        return fruitStorageService.listFruitStorages();
      },
    });
  },
});
