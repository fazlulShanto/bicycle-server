import { Moment } from 'moment';
import { Types } from '../models/database';

interface Bicycle {
  brand: string;
  model: string;
  serialNumber: number;
  purchaseMonth: number;
  purchaseYear: number;
  isRevised: boolean;
  revisionMonth?: number;
  revisionYear?: number;
  dailyCommute: DailyCommute;
  recreationalCommute?: RecreationalCommute;
  bicycleParts?: BicycleParts[];
  totalHealth?: number;
}

interface DailyCommute {
  days: string[];
  unpavedRoad: number;
  totalDistance: number;
}

interface RecreationalCommute {
  days: string[];
  activityType: string[];
  lengthOfRide: number;
}

interface BicycleParts {
  subpart: Types.ObjectId;
  health: number;
  lastMaintained: Moment;
}

export { Bicycle, BicycleParts };
