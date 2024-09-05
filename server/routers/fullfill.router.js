const express = require("express"); // import router from express
const router = express.Router();

const UserModel = require("../models/user.model");
const PracticeModel = require("../models/practice.model");
const TransactionModel = require("../models/transaction.model");

const { STRIPE_KEY, STRIPE_WEBHOOK } = process.env;
const endpointSecret = STRIPE_WEBHOOK;
const stripe = require("stripe")(STRIPE_KEY);

const fulfillPurchase = async (lineItems) => {
  const transaction = lineItems.metadata.transaction;
  let transRecord = await TransactionModel.findById(transaction);
  transRecord.status = true;
  transRecord.save();

  const customer = await UserModel.findById(transRecord.payer);
  const practice = customer.practice;
  let practiceRecord = await PracticeModel.findOne({ name: practice });
  if (practiceRecord) {
    practiceRecord.credit = practiceRecord.credit + transRecord.amount;
    await practiceRecord.save();
  } else {
    // let newPractice = await PracticeModel.create({ name: practice });
    // newPractice.credit = transRecord.amount;
    // await newPractice.save();
  }
  
  await stripe.paymentLinks.update(lineItems["payment_link"], {
    active: false,
  });
};

router.post("/webhook",
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const payload = request.body;
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log(err);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // console.log("event.type: ", event.type);
    try {
      const session = event.data.object;
      switch (event.type) {
        case 'payment_intent.succeeded': {
          if (session.payment_status === "paid") {
            fulfillPurchase(session);
          }
          break;
        }
        case "checkout.session.completed": {
          if (session.payment_status === "paid") {
            fulfillPurchase(session);
          }
          break;
        }
        case "checkout.session.async_payment_succeeded": {
          fulfillPurchase(session);
          break;
        }
        default:
          break;
      }

      response.status(200).end();
    } catch (err) {
      console.log(err);
      response.status(400).end();
    }
  }
);

module.exports = router;