import { objectType } from "nexus";

export const FruitStorage = objectType({
  name: "FruitStorage",
  definition(t) {
    t.string("name");
    t.int("limitOfFruitToBeStored");
    t.int("amountInStorage");
  },
});
