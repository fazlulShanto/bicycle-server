import { Router, Request, Response, NextFunction } from 'express';
const router = Router();


import { generator } from '../middlewares/generator';
import { cyclistRouter } from './private/cyclist.router';
import { technicianRouter } from './private/technician.router';
import * as paymentController from '../controllers/paypal/paypal.controller';
import { decodeJWT } from '../middlewares/sessionManagement';

// router.use(generator);
router.get('/',(req,res)=> res.send("hello world"));

interface CustomRequest extends Request{
    userMail : string
}




router.use('/cyclist', cyclistRouter);
router.use('/technician', technicianRouter);
router.post('/api/create-payment', paymentController.payment);

router.use('*', (req: Request, res: Response) => res.status(404).send('Error, Not Found!'));

export { router };
