import { ApolloServer } from "apollo-server-express";
import express from "express";
import { connectToDatabase } from "./config/database";
import { schema } from "./schema";
import dotenv from "dotenv";
import "./common/cron";

dotenv.config();

const app = express();
const server = new ApolloServer({
  schema,
});

function startServer() {
  try {
    connectToDatabase(process.env.MONGODB_URI || "").then(() => {
      server.start().then(() => {
        server.applyMiddleware({ app, path: "/graphql" });
        app.listen({ port: process.env.PORT }, () => {
          console.log(`🚀 Server ready at http://localhost:4000/graphql`);
        });
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
