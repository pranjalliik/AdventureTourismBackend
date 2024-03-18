const reservationModel = require('../model/reservationm')
const showModel = require('../model/showm')
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


module.exports.createReservation = async function createReservation(req,res){
    try{
        console.log(req.body)
        let reserData = {};
        reserData.show = req.params.id;
       reserData.user= req.user._id
       let  showData = await showModel.findById(req.params.id);
        
       if(req.body.no > showData.capacity - showData.currCapacity){
        return  res.json({
            message : "housefull",
        })
       }

 
       
       const options = {
           readPreference: 'primary',
           readConcern: { level: 'local' },
           writeConcern: { w: 'majority' }
       };
       
       const session = await mongoose.startSession();
       console.log(reserData)
       let reserCreated
       let updatedShow
       try {
        
           await session.withTransaction(async () => {
                reserCreated = await reservationModel.create( 
                reserData
                );
                updatedShow = await showModel.updateOne(
                   { _id: req.params.id },
                   { $inc: { currCapacity : req.body.no } },
                   { session }
               );
       
               console.log(updatedShow);
       
               if (!updatedShow.acknowledged) {
                   throw new Error("Show document not found or update failed.");
               }
       
               // No need to call commitTransaction or endSession here.
           });
           
           // The withTransaction method will commit the transaction automatically if no errors occurred.
       
           return res.json({
               message: "Reservation created successfully",
               reservation: reserCreated,
               show: updatedShow
           });
       } catch (err) {
           console.error(err);
           return res.status(500).json({
               message: "Error creating reservation",
               errorr: err.message
           });
       } finally {
           session.endSession();
       }
       
       
       

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

   const tour = await showModel.findById(req.params.id)
    .populate({
      path: 'tour',
      model: 'tourModel', // Replace with the actual model name for the tour
    });

 console.log(tour)
    
 /*   const sessions = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
       success_url: `${req.protocol}://${req.get('host')}/tours/?slot=${req.params.id}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/`,
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        //    description : tour.summary,
        //            images: [
       //     `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
         //   'https://www.hlimg.com/images/deals/360X230/deals_201808031533283847-8.jpg'
         // ],
        line_items: [ 
          {
            name: `${tour.name} Tour`,
         
            images: [
              'https://www.hlimg.com/images/deals/360X230/deals_201808031533283847-8.jpg'
            ],
            amount: tour.price ,
            currency: 'inr',
            quantity: req.body.no
          }
        ]

      });
*/
 //  
/*
 const product = await stripe.products.create({
    name: tour.tour.name ,
    description: 'a thrilling experience',
    images: ['https://www.hlimg.com/images/deals/360X230/deals_201808031533283847-8.jpg'],
  });
  

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: tour.tour.price,
    currency: 'inr',
  });
  
      line_items: [{
      price: price.id,
      quantity: req.body.no,
    }],
  
  
  */
  
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


      res.status(200).json({
        status: 'success',
        session
      });

    }catch(err){
        return res.json({
            message: err.message
        })
    }

    }


 module.exports.getUserReservation = async function getUserReservation(req,res){
 
  console.log('there')
  try{
console.log('there')
    let data = await reservationModel.find({ user: req.user._id })
    .populate({
      path: 'show', 
      populate: {
        path: 'tour',
        model: 'tourModel', // Replace 'Tour' with your actual model name for tours
      },
    })
    console.log(data+'fshgk')
    return  res.json({
      message : "your bookings",
      data
  })
   }catch(err){
    return  res.json({
      message : err.message,
  })
   }
 }