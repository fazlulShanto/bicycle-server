import { Types } from '../models/database';

interface Cyclist {
  name: string;
  email: string;
  password: string;
  role: string;
  homeAddress: string;
  workAddress: string;
  phone?: string;
  bicycle?: Types.ObjectId;
  plan: 'basic' | 'quover' | 'jobrad';
  orders?: Types.ObjectId[];
  cases?: Types.ObjectId[];
  imageUrl?: string;
}

export { Cyclist };
