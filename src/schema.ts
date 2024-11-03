import { makeSchema } from "nexus";
import path from "path";
import { FruitStorageMutation } from "./modules/fruitStorage/graphql/resolvers/FruitStorageMutation";
import { FruitStorageQuery } from "./modules/fruitStorage/graphql/resolvers/FruitStorageQuery";
import { FruitStorage } from "./modules/fruitStorage/graphql/types/FruitStorage";

export const schema = makeSchema({
  types: [FruitStorageQuery, FruitStorageMutation, FruitStorage],
});
