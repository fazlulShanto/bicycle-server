import { Schema } from '../../models/database';

const interventionDetailsSchema = new Schema({
	firstCall: {
		type: Schema.Types.Mixed,
	},
	followUpCall: { type: Schema.Types.Mixed },
	supportQuality: { type: Number },
});
export { interventionDetailsSchema };
