import { ApolloServer } from 'apollo-server';
import { schema } from '../../schema';
import { connectToDatabase, disconnectFromDatabase } from '../../config/database';
import dotenv from 'dotenv'

dotenv.config()

const server = new ApolloServer({ schema });

export const executeScript = async (mutation: string, variables?: Record<string, any>) => {
  return await server.executeOperation({
    query: mutation,
    variables,
  });
};

beforeAll(async () => {
  await connectToDatabase(process.env.MONGODB_URI_TEST || "");
});

afterAll(async () => {
  await server.stop();
  await disconnectFromDatabase();
});
