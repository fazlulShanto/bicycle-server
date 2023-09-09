import { Router,Request,Response,NextFunction } from 'express';
import { authenticator } from '../../middlewares/authenticator';

import { cyclistAuthorizer } from '../../middlewares/authorizer';

import * as cyclistController from '../../controllers/cyclist/cyclist.controller';
import * as bicycleController from '../../controllers/bicycle/bicycle.controller';
import * as subpartController from '../../controllers/subpart/subpart.controller';
import * as caseController from '../../controllers/case/case.controller';
import * as orderController from '../../controllers/order/order.controller';
import * as technicianController from '../../controllers/technician/technician.controller';
import { decodeJWT } from '../../middlewares/sessionManagement';

const cyclistRouter = Router();

// public
cyclistRouter.post('/sign-up', cyclistController.signUp);
cyclistRouter.post('/sign-in', cyclistController.signIn);
cyclistRouter.get('/sign-out', cyclistController.signOut);
cyclistRouter.post('/forgot-password', cyclistController.forgotPassword);
cyclistRouter.post('/reset-password', cyclistController.resetPassword);

// private router
// cyclistRouter.use(authenticator, cyclistAuthorizer);
cyclistRouter.use((req:Request,res : Response,next : NextFunction)=>{

    const token = (req.headers['authorization']?.split(' ')?.pop());

    console.log(`*********token=`,token);
    console.log(`((((())))) route-path = ${req.url}`);

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


cyclistRouter.use((req:Request,res : Response , next : NextFunction)=>{
    console.log(`[${new Date().toLocaleTimeString()}]<== ${req.url} ===>  `,req.body._email);
    next();
});


// cyclist
cyclistRouter.get('/profile', cyclistController.profile);
cyclistRouter.post('/set-up-address', cyclistController.setUpAddress);
cyclistRouter.post('/weather-data', cyclistController.weatherData);
cyclistRouter.get('/cyclist-name', cyclistController.cyclistName);
cyclistRouter.put('/select-plan', cyclistController.selectPlan);

// bicycle
cyclistRouter.post('/set-up-bicycle', bicycleController.setUpBicycle);
cyclistRouter.put('/set-up-bicycle-edit/:id', bicycleController.setUpBicycleEdit);
cyclistRouter.get('/bicycle-health/:id', bicycleController.getBicycleHealth);
cyclistRouter.get('/bicycle/:id', bicycleController.getBicycle);
cyclistRouter.get('/bicycle-damaged-part/:id', bicycleController.bicycleDamagedPart);

// order
cyclistRouter.get('/get-plan', orderController.getPlan);
cyclistRouter.post('/create-order', orderController.setUpOrder);

// case
cyclistRouter.post('/create-case', caseController.createPassiveCase);
cyclistRouter.post('/create-chat-case', caseController.createActiveCase);
cyclistRouter.get('/get-all-cases', caseController.getAllCases);
cyclistRouter.get('/get-case-by-id/:id', caseController.getCaseById);
cyclistRouter.get('/case-number', caseController.getCaseNumber);

// subpart
cyclistRouter.post('/add-subparts', subpartController.addSubparts);
cyclistRouter.get('/all-subpart', subpartController.allSubpart);
// cyclistRouter.post('/subpartFix', subpartController.subpartFix);

// technician
cyclistRouter.post('/subpart-expert', technicianController.findSubpartExpart);
cyclistRouter.post('/available-support-time', technicianController.availableSupportTime);

export { cyclistRouter };
