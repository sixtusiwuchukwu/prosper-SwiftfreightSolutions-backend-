import Mongoose from "mongoose";



const quoteSchema = new Mongoose.Schema({
  trackId: {
    type: String,
  },
  senderfullName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  senderPhone: { type: String, required: true },
  senderAddress: { type: String },
  senderCity: { type: String },
  senderState: { type: String },
  senderCountry: { type: String },
  senderZipCode: { type: String },
  receiverfullName: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  receiverAddress: { type: String },
  receiverCity: { type: String },
  receiverState: { type: String },
  receiverCountry: { type: String },
  receiverZipCode: { type: String },
  mode: { type: String, enum: ['air', 'sea', 'road', 'rail'], required: true },
  description: { type: String },
  arrivalDate: { type: Date,required:true },
  pickUp: { type: String, required: true },
  dropOff: { type: String, required: true },
  quantity: { type: String },
  weight: { type: String },
  status: {
    type: String,
    enum:["CONFIRMED ORDER","PROCESSING ORDER",
  "QUALITY CHECK","ON HOLD","DISPATCHED ITEM","PRODUCT DELIVERED"
    ],
    default:"CONFIRMED ORDER"
  },
  currentLocation: {
    type: String,
    default:"not Yet"
  },
},{timestamps:true});

export default Mongoose.model("qoute", quoteSchema);

