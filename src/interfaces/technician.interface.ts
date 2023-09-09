import { Types } from '../models/database';

interface Technician {
  name: string;
  email: string;
  password: string;
  role: string;
  address?: string;
  phone?: string;
  brandsExpertise?: string[];
  subpartExpertise?: Types.ObjectId[];
  workingDays?: string[];
  workingSlots?: string[];
  cases?: Types.ObjectId[];
  wishlist?: string[];
  imageUrl?: string;
}

export { Technician };
