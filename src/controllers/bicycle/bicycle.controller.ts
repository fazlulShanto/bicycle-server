import { Request, Response } from "express";
import { Types } from "../../models/database";

import moment from "moment";
moment().format();

import {
	createBicycle,
	findBicycleHealthById,
	getAllDamagedParts,
	getBicycleById,
	updateBicycle,
} from "../../models/bicycle/bicycle.query";
import { decodeJWT, getSession } from "../../middlewares/sessionManagement";
import { SessionData } from "../../interfaces/session.interface";
import { addBicycle } from "../../models/cyclist/cyclist.query";


import Subparts from "../../models/bicycle/subparts.json";
import { SubpartModel } from "../../models/subpart/subpart.model";
import { getAllSubpart } from "../../models/subpart/subpart.query";
import { Subpart } from "../../interfaces/subpart.interface";

const setUpBicycle = async (req: Request, res: Response) => {

	// console.log(`********************************** i am here `);

	// return res.send("nigga");
	try {
		const {
			brand,
			model,
			serialNumber,
			purchaseMonth,
			purchaseYear,
			isRevised,
			revisionMonth,
			revisionYear,
			dailyCommute,
			recreationalCommute,
			email
		} = req.body;

		// console.log('#############',req.body);
		// return res.json(req.body);

		const newBicycle = {
			brand,
			model,
			serialNumber,
			purchaseMonth,
			purchaseYear,
			isRevised,
			revisionMonth,
			revisionYear,
			dailyCommute: dailyCommute.pop(),
			recreationalCommute: recreationalCommute.pop(),
			totalHealth: 100,
		};

		let lastRevisionMonth: number = purchaseMonth;
		let lastRevisionYear: number = purchaseYear;

		console.log('******=>',lastRevisionYear,lastRevisionMonth);
		
		if (isRevised) {
			revisionMonth && (lastRevisionMonth = revisionMonth);
			revisionYear && (lastRevisionYear = revisionYear);
		}

		
		const lastRevisionDate = moment([
			lastRevisionYear,
			lastRevisionMonth ,
		]);
		console.log(lastRevisionDate);
		const createdBicycle = await createBicycle(
			newBicycle,
			// moment().format().toString()
			lastRevisionDate ?? moment().format().toString()
		);

		// const token = req.cookies.accessToken;
		// console.log("fr token", token);

		// const session: SessionData | undefined = getSession(token);
		// const session: any = decodeJWT(token);
		// console.log(`session :`,session);

		// if (session && createdBicycle) 
		{
			const bicycleId = new Types.ObjectId(createdBicycle!._id);
			// await addBicycle(session.userEmail, bicycleId);
			await addBicycle(email, bicycleId);
			res.status(201).send(createdBicycle);
			return;
		}

		// else{

		// 	return res.status(401).send("Session Unavailable!+");
		// }

	} catch (error) {
		// console.log(error);
		res.status(500).send("Server Error!");
	}
};


const getBicycle = async (req: Request, res: Response) => {
	try {
		const bicycleId = req.params.id;
		const bicycle = await getBicycleById(new Types.ObjectId(bicycleId));
		if (!bicycle) {
			return res.status(401).send("Failed to find bicycle!");
		}

		res.status(200).send(bicycle);
	} catch (error) {
		res.status(500).send(error);
	}
};

const getBicycleHealth = async (req: Request, res: Response) => {
	try {
		const bicycleId: string = req.params.id;
		const bicycle = await findBicycleHealthById(
			new Types.ObjectId(bicycleId)
		);
		if (!bicycle) {
			res.status(401).send("Failed to find bicycle!");
			return;
		}

		res.status(200).send(bicycle);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error!");
	}
};

const setUpBicycleEdit = async (req: Request, res: Response) => {
	try {
		const bicycleId = req.params.id;
		if (!bicycleId) return res.status(401).send("Failed to find bicycle!");
		const {
			brand,
			model,
			serialNumber,
			purchaseMonth,
			purchaseYear,
			isRevised,
			revisionMonth,
			revisionYear,
			dailyCommute,
			recreationalCommute,
			email
		} = req.body;

		const newBicycle = {
			brand,
			model,
			serialNumber,
			purchaseMonth,
			purchaseYear,
			isRevised,
			revisionMonth,
			revisionYear,
			dailyCommute,
			recreationalCommute,
		};

		// console.log(`###############`,email);

		let lastRevisionMonth: number = purchaseMonth;
		let lastRevisionYear: number = purchaseYear;

		if (isRevised) {
			revisionMonth && (lastRevisionMonth = revisionMonth);
			revisionYear && (lastRevisionYear = revisionYear);
		}

		const lastRevisionDate = moment([
			lastRevisionYear,
			lastRevisionMonth - 1,
		]);

		const updatedBicycle = await updateBicycle(
			new Types.ObjectId(bicycleId),
			newBicycle,
			lastRevisionDate
		);

		const token = req.cookies.accessToken;
		const session: SessionData | undefined = getSession(token);
		if (session) {
			res.status(201).send(updatedBicycle);
			return;
		}

		res.status(401).send("Session Unavailable!");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

const bicycleDamagedPart = async (req: Request, res: Response) => {
	try {

		const DAMAGED_LIMIT = 30;

		let bicycleId = req.params.id;
		console.log('🎆🎆🎁🧵🎫 ===>', bicycleId);
		if (!bicycleId) {
			res.status(401).send("Failed to find bicycle!");
			return;
		}

		const allDbSubParts = await getAllSubpart();

		// console.log(allDbSubParts);


		/**
		 * fazlul : 
		 * it returns all the parts not only DAMAGED PARTS
		 */
		const damagedParts = (await getAllDamagedParts(
			new Types.ObjectId(bicycleId)
		))?.filter((v: any) => v.health < DAMAGED_LIMIT);

		// console.log(`✔☑✔✅`,damagedParts);

		if (damagedParts) {

			// const updatedDamagePartsInfo = damagedParts.map((part) => {

			// 	// console.log(`part = `,part);

			// 	const info = Subparts.filter(
			// 		(subpart) => {

			// 			// console.log(`part.subpart  : `,part.subpart);
			// 			// console.log(`subpart.id  : `,subpart._id);


			// 			return subpart._id === String(part.subpart);
			// 		}
			// 	);

			// 	console.log(info);


			// 	const newInfo = {
			// 		_id: part.subpart,
			// 		name: info[0]?.name ?? "limbo"+Math.random(),
			// 		price: info[0]?.price ?? 56,
			// 		category: info[0]?.category,
			// 		plan: info[0]?.plan,
			// 		health: part.health,
			// 		lastMaintained: part.lastMaintained,
			// 	};

			// 	return newInfo;
			// });
			const tst :any = [];

			for (let i = 0; i < damagedParts.length; i++) {

				const dbId = allDbSubParts![0]._id.toString();
				const partId = damagedParts[i].subpart.toString();

				const dbPart : any = await SubpartModel.findOne({ _id: partId });

				if (dbPart) {
					const newInfo = {
						_id: dbPart._id,
						name: dbPart.name ?? "limbo" + Math.random(),
						price: dbPart.price ?? 56,
						category: dbPart.category,
						plan: dbPart.plan,
						health: damagedParts[i].health,
						lastMaintained:damagedParts[i].lastMaintained,
					};
					tst.push(newInfo);
				}

				// console.log(`war = id= ${dbId}`, await SubpartModel.findOne({ _id: partId }));





			}
			// const newDamagedParts = damagedParts;
			// console.log(newDamagedParts);

			res.status(200).send(tst);
			return;
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

export {
	setUpBicycle,
	getBicycle,
	getBicycleHealth,
	setUpBicycleEdit,
	bicycleDamagedPart,
};
