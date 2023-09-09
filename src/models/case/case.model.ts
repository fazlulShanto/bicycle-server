import { Case } from '../../interfaces/case.interface';
import { Schema, model } from '../database';
import { interventionDetailsSchema } from './interventionDetails.schema';
import { noteSchema } from './note.schema';
import { supportTimeSchema } from './supportTime.schema';

const caseSchema = new Schema({
	caseNumber: { type: Number },
	createdTime: { type: Date, default: new Date(), required: true },
	status: { type: String, required: true },
	cyclist: { type: Schema.Types.ObjectId, ref: 'Cyclist', required: true },
	technician: {
		type: Schema.Types.ObjectId,
		ref: 'Technician',
		required: false,
	},
	bicycle: { type: Schema.Types.ObjectId, ref: 'Bicycle', required: true },
	type: { type: String, required: true },
	tags: [{ type: String }],
	order: { type: Schema.Types.ObjectId, ref: 'Order' },
	note: [noteSchema],
	supportTime: supportTimeSchema,
	interventionDetails: interventionDetailsSchema,
	videoURL: { type: String },
});

const CaseModel = model<Case>('Case', caseSchema);

export { CaseModel };
