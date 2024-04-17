const tourModel = require('../model/tourm');
const reviewModel = require('../model/reviewm');
const userModel = require('../model/userm')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError')
const reservationModel = require('../model/reservationm')


exports.createReview = catchAsync( async (req,res,next)=>{
    
    let tourrev = req.body;
    tourrev.tour = req.params.id;
    tourrev.user = req.user._id;
   
   let savereview = await reviewModel.create(tourrev);
   let tour = await tourModel.findById(req.params.id)
   

   let prevtotal =  tour.ratingAverage * tour.reviewNo;

let x = prevtotal + parseInt(req.body.rating)
   let newRating = ( x)/(tour.reviewNo +1)


   tour.ratingAverage = newRating;
   tour.reviewNo = tour.reviewNo +1;
   const updatedData = await tour.save();
   return res.json({
       message: "review created",
       reviewdata: savereview,
       tourdata : updatedData
   })

   
   }
)






exports.canCreateReview = catchAsync( async (req,res,next)=>{
    
     let tourrev = req.body;
     tourrev.tour = req.params.id;
    let reservation = await reservationModel.find({tour : req.params.id,user : req.user._id})
    .populate({
        path: 'show',
        model: 'showModel', // Replace with the actual model name for the tour
      }).exec();
    

     if(!reservation){
        res.status(401).json({
            message:'not  authorized to write reveiew',
            data : ''
            })
     }

     const currentDate = new Date();
let flag = false
console.log(reservation)
     for(let i=0;i<reservation.length;i++){

        if(!reservation[i].show ||currentDate>reservation[i].show.date){
                   flag = true
        }
     }


     if(!flag){
     
        res.status(401).json({
            message:'not  authorized to write reveiew',
            data : ''
            })
        }

        next()

    
    }
)

    exports.allReviews = catchAsync(async (req,res,next)=>{

        console.log("allreview") 
        let reviews = await reviewModel.find();
        let arr = reviews.slice(0,3);
        console.log(arr)
        if(reviews){
            res.json({
            message:'reviews retrived',
            data: arr
            })
        }else{
            res.json({
                message:'reviews not found',
                })
        }
        
    })




  exports.getTourReview =catchAsync( async (req,res,next)=>{

        let id = req.params.id;
        
        let reviews = await reviewModel.find({ tour : id});

        if(!reviews){
            res.json({
                message:'reviews retrived',
                data: []
                })             
          }
  


        res.json({
            message:'reviews retrived',
            data: reviews
            })
        })