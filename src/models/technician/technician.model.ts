import { Technician } from '../../interfaces/technician.interface';
import { Schema, Types, model } from '../database';
import { slotSchema } from './slotSchema';

const technicianSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  brandsExpertise: [{ type: String }],
  subpartExpertise: [{ type: Types.ObjectId, ref: 'SubPartModel' }],
  workingDays: [{ type: String }],
  workingSlots: [slotSchema],
  cases: [{ type: Types.ObjectId, ref: 'CaseModel' }],
  wishlist: [{ type: String }],
  imageUrl: { type: String },
});

const TechnicianModel = model<Technician>('Technician', technicianSchema);

export { TechnicianModel };
