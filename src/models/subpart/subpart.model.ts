import { Subpart } from '../../interfaces/subpart.interface';
import { Schema, model } from '../database';

const subpartSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  depreciationRate: { type: Number, required: true },
  category: { type: String, required: true },
  plan: { type: [String], default: [] },
});

const SubpartModel = model<Subpart>('Subpart', subpartSchema);

export { SubpartModel };
