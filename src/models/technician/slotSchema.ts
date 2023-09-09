import { Schema } from '../database';

export const slotSchema = new Schema({
	slotTime: {
		type: String,
		require: true,
	},
	slotName: {
		type: String,
		require: true,
	},
});
