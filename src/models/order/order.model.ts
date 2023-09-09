import { Order } from '../../interfaces/order.interface';
import { Schema, Types, model } from '../database';

const orderSchema = new Schema({
  bicycleParts: { type: [Types.ObjectId], ref: 'Subpart', required: true },
  deliveryAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },
  note: { type: String },
  slot: { type: String, required: true },
  totalPrice: { type: Number, required: true },
});

const OrderModel = model<Order>('Order', orderSchema);

export { OrderModel };
