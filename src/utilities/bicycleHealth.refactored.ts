import { BicycleParts } from '../interfaces/bicycle.interface';
import { Types } from '../models/database';

import Moment from 'moment';

export function getRevisedBicycleSubPartsHealth(bicycleParts: BicycleParts[]) {
  return [
    {
      subpart: '64d0cfccd7d5ed90771f8cd7',
      health: 90.7799928242984,
      lastMaintained: '2022-12-31T18:00:00.000Z',
    },
  ];
}
