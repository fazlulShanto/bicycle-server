import { Request, Response, NextFunction } from 'express';
import { bicycleHealthAlgorithm } from '../utilities/bicycleHealth.algorithm';

const generator = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(`Time = ${new Date().toLocaleTimeString()}`);
  await bicycleHealthAlgorithm();
  next();
};

export { generator };
