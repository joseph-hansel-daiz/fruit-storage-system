import { ApolloServer } from 'apollo-server';
import { schema } from '../../schema';
import { connectToDatabase, disconnectFromDatabase } from '../../config/database';

const server = new ApolloServer({ schema });

export const executeScript = async (mutation: string, variables?: Record<string, any>) => {
  return await server.executeOperation({
    query: mutation,
    variables,
  });
};

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await server.stop();
  await disconnectFromDatabase();
});
