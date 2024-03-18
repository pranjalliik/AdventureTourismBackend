const tourModel = require('../model/tourm');
const reviewModel = require('../model/reviewm');
const userModel = require('../model/userm')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError')





exports.createReview = catchAsync( async (req,res,next)=>{
    
     let tourrev = req.body;
     tourrev.tour = req.params.id;
    
    
    let savereview = await reviewModel.create(tourrev);
    let tour = await tourModel.findById(req.params.id)
     tourrev.user = await userModel.findById(req.body.user);

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

            console.log("getTourReview")
        let id = req.params.id;
        
        let reviews = await reviewModel.find({ tour : id});

        if(!reviews){
            next(new AppError('reviews not found'))
             
          }
  


        res.json({
            message:'reviews retrived',
            data: reviews
            })
        })