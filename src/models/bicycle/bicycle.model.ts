import { Schema, model } from '../database';
import { Bicycle } from '../../interfaces/bicycle.interface';
import { dailyCommuteSchema } from './dailyCommute.schema';
import { recreationalCommuteSchema } from './recreationalCommute.schema';
import { bicyclePartsSchema } from './bicyclePart.schema';

const bicycleSchema = new Schema({
  brand: { type: String, required: false },
  model: { type: String, required: true },
  serialNumber: { type: Number, required: true },
  purchaseMonth: { type: Number, required: true },
  purchaseYear: { type: Number, required: true },
  isRevised: { type: Boolean, required: true },
  revisionMonth: { type: Number },
  revisionYear: { type: Number },
  dailyCommute: dailyCommuteSchema,
  recreationalCommute: recreationalCommuteSchema,
  bicycleParts: {
    type: [bicyclePartsSchema],
  },

  totalHealth: { type: Number, default: 100, required: true },
});
const bicycleSchema2 = new Schema({
  brand: { type: String, required: false },
  model: { type: String, required: true },
  serialNumber: { type: Number, required: true },
  purchaseMonth: { type: Number, required: true },
  purchaseYear: { type: Number, required: true },
  isRevised: { type: Boolean, required: true },
  revisionMonth: { type: Number },
  revisionYear: { type: Number },
  dailyCommute: Object,
  recreationalCommute: Object,
  bicycleParts: {
    type: [bicyclePartsSchema],
  },

  totalHealth: { type: Number, default: 100, required: true },
});

const BicycleModel = model<Bicycle>('Bicycle', bicycleSchema);
// const BicycleModel2 = model<Bicycle>('Bicycle', bicycleSchema2);



export { BicycleModel ,bicycleSchema2};
