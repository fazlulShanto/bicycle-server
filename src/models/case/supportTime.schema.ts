import { Schema } from '../database';

const supportTimeSchema = new Schema({
  slotName: {
    type: String,
    required: false,
  },
  slotTime: {
    type: String,
    required: false,
  },
  timeStamp: {
    type: Date,
    required: false,
  },
});

export { supportTimeSchema };
