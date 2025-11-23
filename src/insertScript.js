import __userModel from "./model/userModel.js"


export const Insertuser=async()=>{
    let isExist = await __userModel.countDocuments()
    if(!isExist > 0){
        await __userModel.create({email:process.env.EMAIL,password:process.env.PASSWORD})
       return console.log("user inserted");
    }
   return console.log("user Already inserted");


}