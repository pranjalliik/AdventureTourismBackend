const reservationModel = require('../model/reservationm')
const showModel = require('../model/showm')
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay')
const shortid = require('shortid');
const tourModel = require('../model/tourm');


const razorpay = new Razorpay({
	key_id: 'rzp_test_oeAvpf9MwJ4OX9',
	key_secret: 'nI6W2bVYHIJhGvJgazvgx8oA'
})


exports.createReservation = async function createReservation(req,res){

  try{

      const secret = '6543217'

      const crypto = require('crypto')

      const shasum = crypto.createHmac('sha256', secret)
      shasum.update(JSON.stringify(req.body))
      const digest = shasum.digest('hex')
    
      console.log(digest, req.headers['x-razorpay-signature'])
    
      if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit')
        // process it
       console.log(req.body.payload.payment.entity.notes)
       let reserData = {};
       reserData.slot = req.body.payload.payment.entity.notes.slot;
      reserData.user= req.body.payload.payment.entity.notes.user
      reserData.no= req.body.payload.payment.entity.notes.no
      reserData.tour =  req.body.payload.payment.entity.notes.tour
      reserData.amount =  req.body.payload.payment.entity.notes.amount

      let  showData = await showModel.findById(reserData.slot);
      console.log(showData)

      const options = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    
    const session = await mongoose.startSession();
    let reserCreated
    let updatedShow
    console.log('hii')
    try {
     
        await session.withTransaction(async () => {
          console.log('hii')

             reserCreated = await reservationModel.create({user : reserData.user, show: reserData.slot,tour:reserData.tour,amount : reserData.amount});
              console.log(reserCreated)
            console.log(reserData.slot,reserData.no)
             updatedShow = await showModel.updateOne(
                { _id: reserData.slot },
                { $inc: { capacityLeft : -reserData.no } },
                { session }
            );
    
            console.log(updatedShow);
    
            if (!updatedShow.acknowledged) {
                throw new Error("Show document not found or update failed.");
            }
    
            // No need to call commitTransaction or endSession here.
        });
        
        // The withTransaction method will commit the transaction automatically if no errors occurred.
    console.log(reserCreated, updatedShow)


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Error creating reservation",
            errorr: err.message
        });
    } finally {
        session.endSession();
    }
       
  
      } else {
        // pass it
            console.log('request is not legit')
      }

      res.json({ status: 'ok' })


/*

       
        
       if(req.body.no > showData.capacity - showData.currCapacity){
        return  res.json({
            message : "housefull",
        })
       }

 
       
     
       
       
       
*/
    }
    catch(err){
        return res.json({
            message: err.message
        })
    }

}


module.exports.getCheckoutSession = async function getCheckoutSession(req, res) {
    try{
    // 1) Get the currently booked tour
console.log(req.params.id)
   const data = await showModel.findById(req.params.id)
    .populate({
      path: 'tour',
      model: 'tourModel', // Replace with the actual model name for the tour
    }).exec();

   let tprice =  data.tour.price
if(data.capacityLeft === 0 ){
  res.status(200).json({

    message : "housefull"
    })
}
  
 
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

console.log(req.body)


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
user : req.user._id
})


    }catch(err){
        return res.json({
            message: err.message
        })
    }

    }


 module.exports.getUserReservation = async function getUserReservation(req,res){
 
  try{
    const currentDate = new Date();
    console.log('hii ')


    let data = await reservationModel.find({ user: req.user._id , date: { $gt: currentDate } })
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
   }}catch(err){
    return  res.json({
      message : err.message,
  })
   }
 }

 module.exports.getreviewBooking = async function getreviewBooking(req,res){

  try{
console.log(req.user._id)
    const currentDate = new Date();
   let rdata = await reservationModel.aggregate([
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
  ]);

for(let i=0;i<rdata.length;i++){
  
  rdata[i].tour = await tourModel.find({_id : rdata[i].tour} , 'name') 
//  console.log(rdata.tour)
}

console.log(rdata)

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


   }catch(err){
    return  res.json({
      message : err.message,
  })
   }
 }


