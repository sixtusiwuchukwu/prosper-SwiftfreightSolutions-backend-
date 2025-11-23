import express from "express";
import __LogisticsModel from "../model/logisticsModel.js";
import generateTrackId from "../utills/generateTrackId.js";
import IncludeUser from "../utills/auth/includeUsers.js";
import { QuoteTemplate } from "../utills/email/qoute.js";
const router = express();
import nodeMailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

router.post("/createqoute", async (req, res) => {
  let trackId = generateTrackId();
  let saved = await __LogisticsModel.create({ ...req.body, trackId });
  let template = QuoteTemplate(
    saved.email.split("@")[0],
    trackId,
    saved.pickUp,
    saved.dropOff
  );
  let transporter = nodeMailer.createTransport(
    smtpTransport({
      host: "server240.web-hosting.com",
      // host: process.env.MAIL_HOST,
      secureConnection: false,
      tls: {
        rejectUnauthorized: false,
      },

      port: 587,
      //   port: 443,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    })
  );

  // send mail with defined transport object
   transporter.sendMail(
    {
      from: `SWIFT DISTRIBUTION<${"qoute@swiftdistribution.delivery"}>`, // sender address
      to: saved.email, // list of receivers
      subject: "NEW ORDER", // Subject line
      html: template,
    },
    function (error, info) {
      if (error) {
        console.log(error, "from email");
        return;
      }

      console.log(`Sent -> ${info.response}`);
      //   res.send("sucess");
      //   return `${info} Email sent successfully`;
    }
  );

   transporter.sendMail(
    {
      from: `SWIFT DISTRIBUTION<${"qoute@swiftdistribution.delivery"}>`, // sender address
      to: process.env.ADMIN_EMAIL, // list of receivers
      subject: "NEW ORDER", // Subject line
      html: template,
    },
    function (error, info) {
      if (error) {
        console.log(error, "from email");
        return;
      }

      console.log(`Sent -> ${info.response}`);
      //   res.send("sucess");
      return `${info} Email sent successfully`;
    }
  );
  return res
    .status(200)
    .send({ message: `Success!! your item tracking number : ${trackId}` });
});

router.get("/trackitem", async (req, res) => {
  const { trackId } = req.query;
  let found = await __LogisticsModel.findOne({ trackId }, { _id: 0 });

  return res.status(200).send(found);
});

// router.get("/qoutes", IncludeUser, async (req, res) => {
router.get("/qoutes", async (req, res) => {
  // if (!req.user) {
  //   return res.status(408).send("Request TimeOut");
  // }
  let found = await __LogisticsModel.find({}).sort({"_id":-1});

  return res.status(200).send(found);
});


router.put("/status", async (req, res) => {
  const { trackId } = req.query;
  const { status } = req.body;
  // if (!req.user) {
  //   return res.status(408).send("Request TimeOut");
  // }
  if (!trackId && !status) {
    return res.status(206).send({ message: "credentials not found" });
  }
  await __LogisticsModel.findOneAndUpdate({ trackId }, { status });

  return res.status(200).end();
});
router.put("/location", async (req, res) => {
  const { trackId } = req.query;
  const { location } = req.body;
  // if (!req.user) {
  //   return res.status(408).send("Request TimeOut");
  // }
  if (!trackId && !location) {
    return res.status(206).send({ message: "credentials not found" });
  }
  await __LogisticsModel.findOneAndUpdate(
    { trackId },
    { currentLocation: location }
  );

  return res.status(200).end();
});

export default router;
