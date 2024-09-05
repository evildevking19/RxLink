const express = require("express"); // import router from express
const router = express.Router();

const PracticeModel = require("../models/practice.model");
const TransactionModel = require("../models/transaction.model");

const { STRIPE_KEY } = process.env;
const stripe = require("stripe")(STRIPE_KEY);
const productId = "prod_Pcu6du9l3NMP3c";

router.get("/buycredit/:amount", async (req, res) => {
  const { amount } = req.params;
  try {
    if (req.user.practice == '') {
      return res.json({
        status: 'failed',
        error: 'Please update your practice information on your profileF'
      });
    }
    const product = await stripe.products.retrieve(productId);

    let protocol = req.protocol;
    let host = req.hostname;
    let port = process.env.PORT || 8000;

    if (host == "localhost") {
      port = 7000;
    }
    let fullUrl = `${protocol}://${host}:${port}`;

    const price = await stripe.prices.retrieve(product.default_price);
    const transaction = await TransactionModel.create({
      payer: req.user.uid,
      price: price.unit_amount / 100,
      currency: price.currency,
      amount
    });
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: amount,
        },
      ],
      after_completion: {
        type: "redirect",
        redirect: {
          url: fullUrl + "/admin/credit",
        },
      },
      metadata: {
        transaction: transaction._id.toString()
      },
    });

    return res.send({ status: "success", link: paymentLink.url });
  } catch (error) {
    console.error('Error retrieving product:', error);
  }

  return res.json({
    status: 'success',
    link: 'test link'
  });
});

router.get("/getCreditInformation", async (req, res) => {
  const { practice } = req.user;
  const practiceInfo = await PracticeModel.findOne({ name: practice });
  const credit = practiceInfo.credit;
  try {
    const product = await stripe.products.retrieve(productId);
    const price = await stripe.prices.retrieve(product.default_price);
    // console.log(price);
    return res.send({ price: price.unit_amount / 100, currency: price.currency, credit });
  } catch (error) {
    console.error('Error retrieving product:', error);
  }

  return res.json({
    status: 'success',
    link: 'test link'
  });
});

module.exports = router;