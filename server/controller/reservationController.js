const reservationModel = require('../model/reservationm')
const showModel = require('../model/showm')
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay')
const shortid = require('shortid');
const tourModel = require('../model/tourm');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError')

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_SECRET_KEY
})


  module.exports.createReservation = catchAsync(async (req, res, next) => {

  

      const secret = process.env.CRYPTO_SECRET

      const crypto = require('crypto')

      const shasum = crypto.createHmac('sha256', secret)
      shasum.update(JSON.stringify(req.body))
      const digest = shasum.digest('hex')
    
    
      if (digest === req.headers['x-razorpay-signature']) {
        // process it
       let reserData = {};
       reserData.slot = req.body.payload.payment.entity.notes.slot;
      reserData.user= req.body.payload.payment.entity.notes.user
      reserData.no= req.body.payload.payment.entity.notes.no
      reserData.tour =  req.body.payload.payment.entity.notes.tour
      reserData.amount =  req.body.payload.payment.entity.notes.amount
      reserData.capacityToReduce = req.body.payload.payment.entity.notes.capacityToReduce,
      reserData.date = req.body.payload.payment.entity.notes.date
      let  showData = await showModel.findById(reserData.slot);

      const options = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' } 
    };
    
    const session = await mongoose.startSession();
    let reserCreated
    let updatedShow

    try {
     
        await session.withTransaction(async () => {

             reserCreated = await reservationModel.create({user : reserData.user, show: reserData.slot,tour:reserData.tour,amount : reserData.amount ,date : reserData.date});
          
             updatedShow = await showModel.updateOne(
                { _id: reserData.slot },
                { $inc: { capacityLeft : -reserData.capacityToReduce } },
                { session }
            );
    
    
            if (!updatedShow.acknowledged) {
                throw new Error("Show document not found or update failed.");
            }
    
            // No need to call commitTransaction or endSession here.
        });
        
        // The withTransaction method will commit the transaction automatically if no errors occurred.


    } catch (err) {
        return res.status(500).json({
            message: "Error creating reservation",
            errorr: err.message
        });
    } finally {
        session.endSession();
    }
       
  
      } else {
        // pass it
      }

      res.json({ status: 'ok' })

 
})

module.exports.getCheckoutSession = catchAsync(async (req, res, next) => {
   
    // 1) Get the currently booked tour
   const data = await showModel.findById(req.params.id)
    .populate({
      path: 'tour',
      model: 'tourModel', // Replace with the actual model name for the tour
    }).exec();
    
   let tprice =  data.tour.price
if(data.capacityLeft < req.body.capacityToReduce){

  res.status(400).json(
    {
     message : "housefull"
    })
}else{
  
 
  /*   stripe
  const lineItems = [{
    price_data:{
        currency:"inr",
        product_data:{
            name: tour.tour.name,
            images: ['https://www.hlimg.com/images/deals/360X230/deals_201808031533283847-8.jpg']
        },
        unit_amount:tour.tour.price * 100,
    },
    quantity:req.body.no
}];


  const session = await stripe.checkout.sessions.create({
   
    line_items:lineItems,
    mode: "payment",
    success_url: `http://localhost:3000/success?slot=${req.params.id}&quant=${req.body.no}`,
    cancel_url: 'http://localhost:3000/tours/'
  });




console.log(session)
*/

 
//console.log('hii')
const options = {
    amount:  tprice * 100 * req.body.no,
    currency : 'INR',
    receipt: shortid.generate(),
     payment_capture : 1

}

const response = await razorpay.orders.create(options)

res.status(200).json({
id: response.id,
currency: response.currency,
amount: response.amount,
tour : data.tour._id, 
name : data.tour.name,
user : req.user._id,
date : data.expireAt, 
capacityToReduce : req.body.capacityToReduce
})

    }

    }
)


    module.exports.getUserReservation = catchAsync(async (req, res, next) => {
  
    const currentDate = new Date();



    let data = await reservationModel.find({ user: req.user._id  , date : { $gt : currentDate} })
    .populate({
      path: 'tour',
      model: 'tourModel', // Replace with the actual model name for the tour
    })
    .populate({
      path: 'show',
      model: 'showModel' // Replace with the actual model name for the show
    }) 
    .exec();

  
    if(data){
    return  res.json({
      message : "your bookings",
      data
  })
}else{
  return  res.json({
    message : "no bookings",
    data : []
})
   }
 })


 module.exports.getreviewBooking = catchAsync(async (req, res, next) => {

    const currentDate = new Date();
 /*  let rdata = await reservationModel.aggregate([
      {
          $match: {
              reviewed: 'false',
               date : { $lte : currentDate},
                user : req.user._id
          }
      },
      {
          $group: {
              _id: "$tour", // Group by the tour field
              reservation: { $first: "$$ROOT" } // Select the first reservation document for each tour
          }
      },
      {
          $replaceRoot: { newRoot: "$reservation" } // Replace the root document with the reservation documents
      }
  ]);*/

  let rdata = await reservationModel.find({ user: req.user._id  , date : { $lte : currentDate} })


 // console.log(rdata + 'rgb')

  for(let i=0;i<rdata.length;i++){
  
  rdata[i].tour = await tourModel.find({_id : rdata[i].tour} , 'name') 
}


  if(rdata){
    return  res.json({
      message : "your bookings",
      data : rdata
  })
}else{
  return  res.json({
    message : "no bookings",
    data : []
})
   }
 })


