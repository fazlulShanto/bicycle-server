import { Request, Response } from 'express';
import { createNewCase, findAllCases, findCaseById } from '../../models/case/case.query';
import { getSession } from '../../middlewares/sessionManagement';
import { SessionData } from '../../interfaces/session.interface';
import { findCyclistByEmail } from '../../models/cyclist/cyclist.query';
import { findSubpartTechnician, findTechnicianById } from '../../models/technician/technician.query';
import { findOrderById } from '../../models/order/order.query';
import { Types } from '../../models/database';
import { CaseModel } from '../../models/case/case.model';

const createPassiveCase = async (req: Request, res: Response) => {
	console.log(req.body);
	try {
		const { type, tags, note, supportTime, interventionDetails, orderId } = req.body;

		// const token = req.cookies.accessToken;
		// const session: SessionData | undefined = getSession(token);
		const session= { userEmail : req.body._email };

		if (session) {
			const cyclist = await findCyclistByEmail(session.userEmail);

			if (!cyclist) {
				return res.status(404).send('Cyclist not found.');
			}

			const order = await findOrderById(new Types.ObjectId(orderId));

			if (order) {
				const subparts = order.bicycleParts;
				const technician = await findSubpartTechnician(subparts);
				const technicianId = technician?._id;

				const newCase = {
					cyclist: cyclist._id,
					bicycle: cyclist.bicycle,
					technician: technicianId,

					order: orderId,
					status: 'ongoing',
					type,
					tags,
					note,
					interventionDetails,
					supportTime,
				};

				const createdCase = await createNewCase(newCase);

				if (createdCase) {
					cyclist.cases?.push(createdCase._id);
					await cyclist.save();
					technician?.cases?.push(createdCase._id);
					await technician?.save();

					res.status(200).send(createdCase);
					return;
				}
			}
			return res.status(401).send('Order Not Found!');
		}
		return res.status(401).send('Session Not Found!');
	} catch (error) {
		console.error('Creating case failed!', error);
		res.status(501).send('Creating case failed!');
	}
};

const createActiveCase = async (req: Request, res: Response) => {
	try {
		const { type, tags, supportTime, interventionDetails, subparts } = req.body;

		// const token = req.cookies.accessToken;
		// const session: SessionData | undefined = getSession(token);

		const session= { userEmail : req.body._email };

		if (session) {
			const cyclist = await findCyclistByEmail(session.userEmail);

			if (!cyclist) {
				return res.status(404).send('Cyclist not found.');
			}
			const technician = await findSubpartTechnician(subparts);
			const technicianId = technician?._id;

			const newCase = {
				cyclist: cyclist._id,
				bicycle: cyclist.bicycle,
				technician: technicianId,

				status: 'ongoing',
				type,
				tags,

				interventionDetails,

				supportTime,
			};

			const createdCase = await createNewCase(newCase);
			if (createdCase) {
				cyclist.cases?.push(createdCase._id);
				await cyclist.save();
				res.status(200).send(createdCase);
				return;
			}
		}
		return res.status(401).send('Unauthorized');
	} catch (error) {
		console.error('Creating case failed!', error);
		res.status(501).send('Creating case failed!');
	}
};

const getAllCases = async (req: Request, res: Response) => {
	try {
		// const token = req.cookies.accessToken;

		// const session: SessionData | undefined = getSession(token);
		const session= { userEmail : req.body._email };

		if (session) {
			const cases = await findAllCases(session.userEmail);
			res.status(200).send(cases);
		}
	} catch (error) {
		console.error('Could not get all cases!');
		res.status(502).send('Could not find all cases!');
	}
};

const getCaseById = async (req: Request, res: Response) => {
	try {
		const caseId = req.params.id;

		if (!caseId) {
			res.status(402).send('Case id not found!');
			return;
		}

		const caseResult = await findCaseById(caseId);
		res.status(200).send(caseResult);
	} catch (error) {
		console.error('Could not find case!');
		res.status(502).send('Could not find case!');
	}
};

const getCaseNumber = async (req: Request, res: Response) => {
	console.log(req.body);
	try {
		const caseResult = await CaseModel.find({});
		res.status(200).send({ caseNumber: caseResult.length + 1 });
	} catch (error) {
		console.error('Could not find case!');
		res.status(502).send('Could not find case!');
	}
};

export { createPassiveCase, createActiveCase, getAllCases, getCaseById, getCaseNumber };
