import { Cyclist } from '../../interfaces/cyclist.interface';
import { Types } from '../database';
import { CyclistModel } from './cyclist.model';

const createCyclist = async (cyclistDetails: Cyclist) => {
  try {
    return await CyclistModel.create(cyclistDetails);
  } catch (error) {
    console.log(error);
  }
};

const findCyclistByEmail = async (email: string) => {
  try {
    return await CyclistModel.findOne({ email: email });
  } catch (error) {
    console.log(error);
  }
};

const updateCyclistPassword = async (email: string, newPassword: string) => {
  try {
    return await CyclistModel.findOneAndUpdate({ email: email }, { password: newPassword });
  } catch (error) {
    console.log(error);
  }
};

const addCyclistAddress = async (email: string, homeAddress: string, workAddress: string) => {
  try {
    return await CyclistModel.findOneAndUpdate(
      { email: email },
      { homeAddress: homeAddress, workAddress: workAddress }
    );
  } catch (error) {
    console.log(error);
  }
};

const addCyclistPlan = async (email: string, plan: string) => {
  try {
    return await CyclistModel.findOneAndUpdate({ email: email }, { plan: plan });
  } catch (error) {
    console.log(error);
  }
};

const addBicycle = async (email: string, bicycleId: Types.ObjectId) => {
  try {
    return await CyclistModel.findOneAndUpdate({ email: email }, { bicycle: bicycleId });
  } catch (error) {
    console.log(error);
  }
};

export {
  createCyclist,
  findCyclistByEmail,
  updateCyclistPassword,
  addCyclistAddress,
  addCyclistPlan,
  addBicycle,
};
