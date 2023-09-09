import { Router ,Request,Response,NextFunction} from 'express';
import { authenticator } from '../../middlewares/authenticator';
import { technicianAuthorizer } from '../../middlewares/authorizer';

import * as technicianController from '../../controllers/technician/technician.controller';
import * as caseController from '../../controllers/case/case.controller';
import { decodeJWT } from '../../middlewares/sessionManagement';

const technicianRouter = Router();


technicianRouter.use((req:Request,res : Response,next : NextFunction)=>{

  const token = (req.headers['authorization']?.split(' ')?.pop());
  console.log(`|||----${req.url}----||||`);
  // console.log(`*********token=`,token);
  // console.log(`((((())))) route-path = ${req.url}`);

  let decoded;
  try {
      if(token){

          decoded = decodeJWT(token!);
      }
      // console.log('%%%%%%%%',decoded);
  } catch (error) {
      decoded = null;
  }
  if(decoded){
          req.body._email = decoded?.userEmail;
  }
      next();
  //     else{
  //     return res.sendStatus(404).send("jwt token not found!");
  // }
});


// public
technicianRouter.post('/sign-up', technicianController.signUp);
technicianRouter.post('/sign-in', technicianController.signIn);
technicianRouter.get('/sign-out', technicianController.signOut);
technicianRouter.post('/forgot-password', technicianController.forgotPassword);
technicianRouter.post('/reset-password', technicianController.resetPassword);

// private router
// technicianRouter.use(authenticator, technicianAuthorizer);

// technician
technicianRouter.get('/profile', technicianController.profile);
technicianRouter.put('/profile-edit', technicianController.editProfile);
technicianRouter.post(
  '/set-up-technician',
  technicianController.setUpTechnician
);

// bicycle

// case
technicianRouter.get('/get-all-cases', caseController.getAllCases);
technicianRouter.get('/get-case-by-id/:id', caseController.getCaseById);

// order

// subpart

export { technicianRouter };
