import { SubpartModel } from './subpart.model';
import { Subpart } from '../../interfaces/subpart.interface';
import { Types } from '../database';

const addAllSubpart = async (subparts: Subpart[]) => {
  try {
    return await SubpartModel.insertMany(subparts);
  } catch (error) {
    console.log(error);
  }
};

const getAllSubpart = async () => {
  try {
    return await SubpartModel.find({});
  } catch (error) {
    console.log(error);
  }
};

const getSubpartById = async (subpartId: Types.ObjectId) => {
  try {
    return await SubpartModel.findById(subpartId);
  } catch (error) {
    console.log(error);
  }
};

export { addAllSubpart, getAllSubpart, getSubpartById };
