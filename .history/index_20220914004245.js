	import env from "dotenv";
env.config()
import express, { urlencoded, json } from "express";
import Mongoose from "mongoose";
import userApi from "./src/route/user.js";
import logisticsApi from "./src/route/logistics.js";
import cors from "cors";
import { Insertuser } from "./src/insertScript.js";
import cookieParser from 'cookie-parser'
import generateInvoice from "./src/utills/generateInvoice.js";
const app = express();



const corsOptions = {
  origin:["https://swiftdistribution.delivery","https://www.swiftdistribution.delivery","http://127.0.0.1:8080"], 
  // origin:'http://127.0.0.1:8080', 
   credentials:true,      
   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],      //access-control-allow-credentials:true
   optionSuccessStatus:200,
   
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.json());
app.get("/",async(req,res)=>{
   generateInvoice()
})
app.use("/user", userApi);
app.use("/logistics", logisticsApi);


Mongoose.connect( process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async() => {
   await Insertuser()
      console.log(`Database is connected to ${process.env.DB_URL}`);
  })
  .catch((err) => {
    setTimeout(() => {
      console.log("could not connect");
      console.log(err);
    }, 4000);
    console.log("...connecting to database");
  });


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`logistics server is connected on port ${PORT}`);
});
