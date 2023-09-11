import { CaseModel } from './case.model';
import { Case } from '../../interfaces/case.interface';
import { findCyclistByEmail } from '../cyclist/cyclist.query';
import { findTechnicianByEmail, findTechnicianById } from '../technician/technician.query';

const createNewCase = async (item: Case) => {
	try {
		const lastCase = await CaseModel.findOne({}, {}, { sort: { caseNumber: -1 } });

		const newCase = await CaseModel.create({
			...item,
			caseNumber: lastCase && lastCase.caseNumber ? lastCase.caseNumber : 1,
		});

		if (newCase) {
			const updatedCase = await CaseModel.findByIdAndUpdate(
				{ _id: newCase._id },
				{
					$inc: {
						caseNumber: 1,
					},
				},
				{ new: true }
			);

			return updatedCase;
		}
	} catch (error) {
		console.log(error);
	}
};

const findAllCases = async (email: string) => {
	try {
		const cyclist = await findCyclistByEmail(email);
		const technician = await findTechnicianByEmail(email);
		if (cyclist && cyclist.role === 'cyclist') {

			// console.log(`✨🎐🎗🖼🥼🥼🥼🎢🎢🕶🎨🖼🖼`,cyclist);
			return await CaseModel.find({ cyclist: cyclist?._id }).populate({
				path: 'order',
				populate: 'bicycleParts',
			});
		} else {
			return await CaseModel.find({ technician: technician?._id })
			.populate('cyclist')
			.populate({ path: 'bicycle', populate: 'totalHealth' })
			.populate({path: 'order',	populate: 'bicycleParts'});
		}
	} catch (error) {
		console.log(error);
	}
};

const findCaseById = async (caseId: string) => {
	return await CaseModel.find({ _id: caseId }).populate('cyclist').populate('technician').populate({ path: 'bicycle', populate: 'bicycleParts.subpart' }).populate({
		path: 'order',
		populate: 'bicycleParts',
	});
};

export const updateCaseById = async (caseId: string) => {
	return await CaseModel.findOneAndUpdate({ _id: caseId },{status : 'Finished'});
};

export { createNewCase, findAllCases, findCaseById };
