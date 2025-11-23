
import jwt from "jsonwebtoken";
export default async function getToken({ email, _id }) {
  return jwt.sign({ email, _id }, process.env.SECRETKEY,{ expiresIn: 60 * 60 });
}
