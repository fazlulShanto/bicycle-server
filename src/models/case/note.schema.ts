import { Schema } from '../database';

const noteSchema = new Schema({
  text: { type: String, required: true },
  timeStamp: { type: Date, required: true },
});

export { noteSchema };
