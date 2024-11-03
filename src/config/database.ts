import mongoose from "mongoose";

function connectToDatabase(uri: string): Promise<void> {
  return mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to MongoDB", uri);
    })
    .catch((error) => {
      console.error("Failed to connect to MongoDB", error);
      throw error;
    });
}

function disconnectFromDatabase(): Promise<void> {
  return mongoose.connection
    .close()
    .then(() => {
      console.log("Disconnected from MongoDB");
    })
    .catch((error) => {
      console.error("Error disconnecting from MongoDB", error);
      throw error;
    });
}

export { connectToDatabase, disconnectFromDatabase };
