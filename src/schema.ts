import { makeSchema } from "nexus";
import { FruitMutation } from "./modules/fruit/graphql/resolvers/FruitMutation";
import { FruitQuery } from "./modules/fruit/graphql/resolvers/FruitQuery";
import { Fruit } from "./modules/fruit/graphql/types/Fruit";
import { FruitStorageMutation } from "./modules/fruitStorage/graphql/resolvers/FruitStorageMutation";
import { FruitStorageQuery } from "./modules/fruitStorage/graphql/resolvers/FruitStorageQuery";
import { FruitStorage } from "./modules/fruitStorage/graphql/types/FruitStorage";

export const schema = makeSchema({
  types: [
    FruitStorageQuery,
    FruitStorageMutation,
    FruitStorage,
    FruitQuery,
    FruitMutation,
    Fruit,
  ],
});
