import { Types } from '../database';
import { BicycleModel } from './bicycle.model';

import { Bicycle, BicycleParts } from '../../interfaces/bicycle.interface';
import moment, { Moment } from 'moment';
import { getAllSubpart } from '../subpart/subpart.query';
import { dailyCommuteSchema } from './dailyCommute.schema';
moment().format();

const createBicycle = async (bicycle: Bicycle, lastMaintained: any) => {
  try {
    const bicycleSubparts = await getAllSubpart();

    if (bicycleSubparts) {
      const BicycleParts: BicycleParts[] = bicycleSubparts.map((subpart) => ({
        subpart: subpart._id,
        health: 100,
        lastMaintained: lastMaintained,
      }));

      bicycle.bicycleParts = BicycleParts;

      // console.log(`=========`,lastMaintained,moment().format());
      // console.log(bicycle.dailyCommute);
      // BicycleModel.schema = bicycleSchema2;
      return await BicycleModel.create(bicycle);
    }

    return null;
  } catch (error) {
    console.log(`Failed to create bicycle at : bicycle.query.ts `,(error as Error).message);
    // console.error(error);
  }
};

const getBicycleById = async (bicycleId : Types.ObjectId) => {
  try {
    const bicycle = await BicycleModel.findById({ _id: bicycleId }).populate(
      'bicycleParts.subpart'
    );
    if (bicycle) {
      return bicycle;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
};


const findBicycleHealthById = async (bicycleId: Types.ObjectId) => {
  try {
    const bicycle = await BicycleModel.findById(
      { _id: bicycleId },
      { totalHealth: 1 }
    );
    if (bicycle) return bicycle;
    return null;
  } catch (error) {
    console.error(error);
  }
};

const updateBicycle = async (
  bicycleId: Types.ObjectId,
  bicycle: Bicycle,
  lastMaintained: Moment
) => {
  try {
    const bicycleSubparts = await getAllSubpart();

    if (bicycleSubparts) {
      const BicycleParts: BicycleParts[] = bicycleSubparts.map((subpart) => ({
        subpart: subpart._id,
        health: 100,
        lastMaintained: lastMaintained,
      }));

      bicycle.bicycleParts = BicycleParts;

      const updatedBicycle = await BicycleModel.findOneAndUpdate(
        { _id: bicycleId },
        { $set: bicycle },
        { new: true }
      ).exec();

      return updatedBicycle;
    }

    return null;
  } catch (error) {
    console.error(error);
  }
};

const getAllBicycle = async () => {
  try {
    const allBicycle = await BicycleModel.find({});

    return allBicycle;
  } catch (error) {
    console.error(error);
  }
};

const bicycleHealthUpgration = async (
  bicycleId: Types.ObjectId,
  bicycle: Bicycle
) => {
  try {
    const updatedBicycle = await BicycleModel.findOneAndUpdate(
      { _id: bicycleId },
      { $set: bicycle },
      { new: true }
    );

    if (!updatedBicycle) {
      throw new Error('Bicycle not found!');
    }

    return updatedBicycle;
  } catch (error) {
    console.error(error);
  }
};

const getAllDamagedParts = async (bicycleId: Types.ObjectId) => {
  try {
    const bicycle = await BicycleModel.find(
      { _id: bicycleId },
      { bicycleParts: 1 }
    );
    if (bicycle) {
      return bicycle[0].bicycleParts;
    }

    return null;
  } catch (error) {
    console.error(error);
  }
};

export {
  createBicycle,
  getBicycleById,
  findBicycleHealthById,
  updateBicycle,
  getAllBicycle,
  bicycleHealthUpgration,
  getAllDamagedParts,
};
