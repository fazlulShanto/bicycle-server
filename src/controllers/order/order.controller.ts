import { Request, Response } from 'express';
import { getSession } from '../../middlewares/sessionManagement';
import { SessionData } from '../../interfaces/session.interface';

import { addOrder, createOrder, fetchCyclistPlan } from '../../models/order/order.query';

const setUpOrder = async (req: Request, res: Response) => {
  try {
    const { bicycleParts, deliveryAddress, contactNumber, note, slot, totalPrice } = req.body;
    const newOrder = {
      bicycleParts,
      deliveryAddress,
      contactNumber,
      note,
      slot,
      totalPrice,
    };
    const createdOrder = await createOrder(newOrder);

    // const token = req.cookies.accessToken;
    // const session: SessionData | undefined = getSession(token);
    const session= true;
    if (session) {
      const orderId = createdOrder!._id;
      console.log(`&&&&& email `,req.body._email);
      await addOrder(req.body._email, orderId);
      res.status(201).send(createdOrder);
    }
  } catch (error) {
    console.error('Creating order failed!');
    res.status(500).send('Server Error!');
  }
};

const getPlan = async (req: Request, res: Response) => {
  try {

    // const token = req.cookies.accessToken;
    // const session: SessionData | undefined = getSession(token);
    const session = req.body._email ;
    if (session) {
      const plan = await fetchCyclistPlan(session);
      if (!plan) {
        res.status(401).send('Not able to find plan!');
        return;
      }

      res.status(200).send(plan);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error!');
  }
};

export { setUpOrder, getPlan };
