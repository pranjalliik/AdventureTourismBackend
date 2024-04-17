const express = require('express');
let reviewRouter = express.Router();

const {allReviews,getTourReview ,createReview,canCreateReview/*,updateReview,deleteReview*/} = require('../controller/reviewcontroller');
let{protectRoute,isAuthorized,uploaduserphoto} = require('../controller/authcontroller');


reviewRouter.get('/',allReviews)


reviewRouter.get("/:id", getTourReview)


reviewRouter.post("/:id",protectRoute,canCreateReview, createReview)

 
 
module.exports = reviewRouter;