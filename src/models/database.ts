import mongoose, { Schema, Types, model } from 'mongoose';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });
// dotenv.config();
try {
  mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`);
} catch (error) {
  console.log(error);
}

export { Schema, Types, model };
