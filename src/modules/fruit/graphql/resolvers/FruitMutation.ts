import { extendType, intArg, nonNull, stringArg } from "nexus";
import fruitService from "../../application/FruitService";

export const FruitMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createFruitForFruitStorage", {
      type: "Fruit",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        limitOfFruitToBeStored: nonNull(intArg()),
      },
      resolve: async (_, { name, description, limitOfFruitToBeStored }) => {
        return fruitService.createFruit(
          name,
          description,
          limitOfFruitToBeStored,
        );
      },
    });

    t.field("updateFruitForFruitStorage", {
      type: "Fruit",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        limitOfFruitToBeStored: nonNull(intArg()),
      },
      resolve: async (_, { name, description, limitOfFruitToBeStored }) => {
        return fruitService.updateFruit(
          name,
          description,
          limitOfFruitToBeStored,
        );
      },
    });
  },
});
