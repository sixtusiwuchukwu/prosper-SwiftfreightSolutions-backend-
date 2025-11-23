import express from "express";
import __userModel from "../model/userModel.js";
import includeUsers from "../utills/auth/includeUsers.js";
import getToken from "../utills/tokenGenerator.js";

const router = express();

const cookieOptions = {
  maxAge: 2 * 60 * 60 * 1000,
  secure: true,
  httpOnly: true,
  sameSite: "None",
  //   sameSite: "lax",
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(206).send({ message: "credentials not found" });
  }
  let isfound = await __userModel.findOne({ email });
  if (!isfound) {
    return res.status(206).send({ message: "user not found" });
  }
  let ispassword = await __userModel.comparePassword(
    isfound.password,
    password
  );
  if (!ispassword) {
    return res.status(206).send({ message: "incorrect password" });
  }
  let token = await getToken(isfound);
  res.cookie("x-token", token, cookieOptions);
  res.send({ message: "success" });
});


router.post("/logout", (req, res) => {
  res.clearCookie("x-token", {
    maxAge: 1,
    secure: true,
    httpOnly: true,
    sameSite: "None",
  });
  res.end();
});
router.post("/password", includeUsers, async (req, res) => {
  if (!req.user) {
    return res.status(408).send("Request TimeOut");
  }
  const { oldPassword, newPassword } = req.body;
  const { _id } = req.user;

  let found = await __userModel.findById(_id);

  if (!found) {
    return res.status(208).send("user not found");
  }

  let ispassword = await __userModel.comparePassword(
    found.password,
    oldPassword
  );

  if (!ispassword) {
    return res.send("incorrect old password");
  }

  found.password = newPassword;
  await found.save();
  return res.send("success");
});

export default router;
