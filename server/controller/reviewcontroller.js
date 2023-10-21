const tourModel = require('../model/tourm');
const reviewModel = require('../model/reviewm');
const userModel = require('../model/userm')


const catchAsync = fn => {
    return(req,res,next)=>{
    fn(req,res,next).catch(next)
}
}


module.exports.createReview = async function createReview(req,res){
    try{
    
    
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
    }catch(err){
        return res.json({
            message: err.message
        })
    }
    
    }


    module.exports.allReviews = catchAsync(async function allReviews(req,res){

        console.log("allreview")
        let reviews = await reviewModel.find();
        let arr = reviews.slice(0,3);
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



    module.exports.getTourReview = async function getTourReview(req,res){
        console.log("getTourReview")

        try{
            console.log("getTourReview")
        let id = req.params.id;
        
        let reviews = await reviewModel.find({ tour : id});
        res.json({
            message:'reviews retrived',
            data: reviews
            })
        }catch(err){
            return res.json({
                message: err.message
            })
        }

    }