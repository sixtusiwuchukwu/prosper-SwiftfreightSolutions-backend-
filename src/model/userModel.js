import mongoose from "mongoose";
import { randomBytes, scryptSync } from "crypto";
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})


userSchema.pre("save", function saveHook(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");
  user.password = `${scryptSync(user.password, salt, 32).toString(
    "hex"
  )}:${salt}`;
  return next();
});

userSchema.statics.comparePassword = async ( storedPassword,
  userPassword
) => {
  const [key, salt] = storedPassword.split(":");
  const userPass= scryptSync(userPassword, salt, 32).toString("hex");
  return userPass === key;
};

export default mongoose.model("user",userSchema)

