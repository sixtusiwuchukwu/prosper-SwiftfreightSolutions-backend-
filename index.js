	import env from "dotenv";
env.config()
import express, { urlencoded, json } from "express";
import Mongoose from "mongoose";
import userApi from "./src/route/user.js";
import logisticsApi from "./src/route/logistics.js";
import cors from "cors";
import { Insertuser } from "./src/insertScript.js";
import cookieParser from 'cookie-parser'
import invoice from "./src/utills/generateInvoice.js";
const app = express();



const corsOptions = {
  origin:["https://swiftfreightsolutions.ltd","https://www.swiftfreightsolutions.ltd","http://127.0.0.1:5500"], 
  // origin:'http://127.0.0.1:8080', 
   credentials:true,      
   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],      //access-control-allow-credentials:true
   optionSuccessStatus:200,
   
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.get("/",async(req,res)=>{
  const invoiceData = {
    userName: "John Doe",
    senderfullName: "Jane Smith",
    pickUp: "Lagos",
    dropOff: "Abuja",
    cargoType: "Electronics",
  };
  
  // const trackId = "12345";
  
  // generateInvoicePDF(invoiceData, trackId);
  res.send("okay")
})

app.use("/user", userApi);
app.use("/logistics", logisticsApi);
app.post("/send-mail",async(req,res)=>{
  const {subject,email,body} = req.body
  console.log("from sever send mail")
  try {
    await invoice.sendEmail(body,email,subject)
res.status(200).send({message:"sent !"})
  } catch (error) {
    res.status(500).send({message:"couldn't send"})

  }
})


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


const PORT = process.env.PORT || 2080;

app.listen(PORT, () => {
  console.log(`logistics server is connected on port ${PORT}`);
});
