const express = require('express');
let reservationRouter = express.Router();

let{protectRoute,isAuthorized} = require('../controller/authcontroller');
let{getreviewBooking ,createReservation, getCheckoutSession,getUserReservation} = require('../controller/reservationController');


//reservationRouter.use()

reservationRouter.post('/slot',createReservation)


reservationRouter.post('/checkoutsession/:id',protectRoute,getCheckoutSession)

reservationRouter.get('/getreviewbooking',protectRoute,getreviewBooking)


reservationRouter.get('/getReservations',protectRoute,getUserReservation)





module.exports = reservationRouter;