import { Schema } from '../database';

const supportTimeSchema = new Schema({
  slotName: {
    type: String,
    required: true,
  },
  slotTime: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    required: true,
  },
});

export { supportTimeSchema };
