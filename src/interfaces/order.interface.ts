import { Types } from '../models/database';

interface Order {
  bicycleParts: Types.ObjectId[];
  deliveryAddress: string;
  contactNumber: string;
  note?: string[];
  slot: string;
  totalPrice: number;
}

export { Order };
