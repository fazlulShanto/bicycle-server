import { Types } from '../models/database';

interface Case {
  caseNumber?: number;
  status: string;
  cyclist: Types.ObjectId | undefined;
  technician: Types.ObjectId | undefined;
  bicycle: Types.ObjectId | undefined;
  type: string;
  tags: string[];
  order?: Types.ObjectId;
  note?: Note[];
  supportTime: SupportTime;
  interventionDetails?: InterventionDetails;
  videoURL?: string[];
}

interface Note {
	text: string;
	timeStamp: Date;
}
interface InterventionDetails {
	firstCall: string | Date;
	followUpCall: string | Date;
	supportQuality: Number;
}

interface SupportTime {
	slotName: string;
	slotTime: string;
	timeStamp: Date;
}

export { Case };
