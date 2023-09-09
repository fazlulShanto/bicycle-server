import { Router } from 'express';
import { authenticator } from '../../middlewares/authenticator';
import { technicianAuthorizer } from '../../middlewares/authorizer';

import * as technicianController from '../../controllers/technician/technician.controller';
import * as caseController from '../../controllers/case/case.controller';

const technicianRouter = Router();

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
