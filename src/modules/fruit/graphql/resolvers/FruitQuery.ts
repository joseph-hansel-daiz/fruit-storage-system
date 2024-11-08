import { extendType, list, nonNull, stringArg } from "nexus";
import fruitService from "../../application/FruitService";

export const FruitQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("findFruit", {
      type: "Fruit",
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_, { name }) => {
        return fruitService.findFruit(name);
      },
    });

    t.field("listFruits", {
      type: list("Fruit"),
      resolve: async () => {
        return fruitService.listFruits();
      },
    });
  },
});
