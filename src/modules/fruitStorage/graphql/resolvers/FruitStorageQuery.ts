import { list, nonNull, queryType, stringArg } from "nexus";
import fruitStorageService from "../../application/FruitStorageService";

export const FruitStorageQuery = queryType({
  definition(t) {
    t.field('findFruitStorage', {
      type: 'FruitStorage',
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_, { name }) => {
        return fruitStorageService.findFruitStorage(name);
      },
    });

    t.field('listFruitStorages', {
      type: list('FruitStorage'),
      resolve: async () => {
        return fruitStorageService.listFruitStorages();
      },
    });
  },
});