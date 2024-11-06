import mongoose from "mongoose";

async function connectToDatabase(uri: string): Promise<void> {
  await mongoose.connect(uri);
}

function disconnectFromDatabase(): Promise<void> {
  return mongoose.connection.close();
}

export { connectToDatabase, disconnectFromDatabase };
