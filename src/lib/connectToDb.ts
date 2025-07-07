import mongoose from 'mongoose';
export default async function connectToDb() {
  mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => console.log('Connected To DB'))
    .catch((err: Error) =>
      console.log('Error When Connecting To DB', err.message)
    );
}
