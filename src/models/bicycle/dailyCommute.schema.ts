import { Schema } from '../database';

const dailyCommuteSchema = new Schema(
	{
	days: {
		type: Array,
		required: true,
	},
	unpavedRoad: { type: Number, required: true },
	totalDistance: { type: Number, required: true },
}
);

export { dailyCommuteSchema };
