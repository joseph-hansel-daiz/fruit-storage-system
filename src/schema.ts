import { makeSchema } from "nexus";
import path from 'path';
import { FruitStorageMutation } from "./modules/fruit/graphql/resolvers/FruitStorageMutation";
import { FruitStorageQuery } from "./modules/fruit/graphql/resolvers/FruitStorageQuery";
import { FruitStorage } from "./modules/fruit/graphql/types/FruitStorage";

export const schema = makeSchema({
    types: [FruitStorageQuery, FruitStorageMutation, FruitStorage]
});