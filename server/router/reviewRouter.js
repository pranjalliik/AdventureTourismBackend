const express = require('express');
let reviewRouter = express.Router();

const {allReviews,getTourReview ,createReview/*,updateReview,deleteReview*/} = require('../controller/reviewcontroller');


reviewRouter.route('/')
.get(allReviews)


reviewRouter.route("/:id")
.get(getTourReview)


reviewRouter.route("/:id")
.post(createReview)


 
module.exports = reviewRouter;