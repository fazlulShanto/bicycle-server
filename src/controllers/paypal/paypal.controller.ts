import paypal, { order } from 'paypal-rest-sdk';

paypal.configure({
  mode: 'sandbox',
  client_id:
    'ARJU9bN9kdvuJGc89inQmwDhWBsBnHSfrqcjgz7eabP2iwEpCyFVbgQ4cYVpWnIjLi2elAQb4LPBVmrr',
  client_secret:
    'EN8Mn0y35178MBrGnBPV6MBBx7MO1RvhysBlbz5EisB1yW7EI9Bu9xva_3a4WmpV-bhL-T7XWbGs5l18',
});

export const payment = async (req: any, res: any) => {
  const { totalPrice, supportTime, orderId, note, firstCall } = req.body;

  const partsNote = note.split(' ').join('+');

  const [supportTimeStart, supportTimeEnd] = supportTime.split(' - ');

  const paymentDetails = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    transactions: [
      {
        amount: {
          total: totalPrice ? JSON.stringify(totalPrice) : '10.00',
          currency: 'USD',
        },
        description: 'Purchase Description',
      },
    ],
    redirect_urls: {
      return_url: `${process.env.CLIENT_URL}/thankyou?orderId=${orderId}&supportTimeStart=${supportTimeStart}&supportTimeEnd=${supportTimeEnd}&note=${partsNote}&firstCall=${firstCall}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    },
  };

  paypal.payment.create(paymentDetails, (error: any, payment: any) => {
    if (error) {
      console.log(error.response.details);
      res
        .status(500)
        .json({ error: 'An error occurred while creating the payment.' });
    } else {
      res.json({ approval_url: payment.links[1].href });
    }
  });
};
