import { Request, Response } from 'express';
import { addAllSubpart } from '../../models/subpart/subpart.query';
import allSubparts from '../../models/bicycle/subparts.json';
import { SessionData } from '../../interfaces/session.interface';
import { getSession } from '../../middlewares/sessionManagement';
import { SubpartModel } from '../../models/subpart/subpart.model';

const addSubparts = async (req: Request, res: Response) => {
  try {
    const allSubpart = req.body;
    await addAllSubpart(allSubpart);

    res.status(200).send('All subparts added.');
  } catch (error) {
    console.log(error);
  }
};

const allSubpart = async (req: Request, res: Response) => {
  try {
    // const token = req.cookies.accessToken;
    // const session: SessionData | undefined = getSession(token);
    // if (token) {
    //   res.status(200).send(allSubparts);
    //   return;
    // }

    const result = await SubpartModel.find({}).exec();

    return res.json(result);
  } catch (error) {
    console.error('Could not get plan!');
    res.status(500).send('Server Error!');
  }
};

// const subpartFix = async (req: Request, res: Response) => {
//   try {
//     const categories = req.body.categories;
//     categories.forEach(async (category: string) => {
//       await SubpartModel.updateMany(
//         {
//           category,
//         },
//         {
//           $set: {
//             category: category.split(' ').join(''),
//           },
//         }
//       );
//     });
//     res.send(200);
//   } catch (error) {}
// };

export { addSubparts, allSubpart };
