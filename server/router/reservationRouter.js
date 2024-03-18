const express = require('express');
let reservationRouter = express.Router();

let{protectRoute,isAuthorized} = require('../controller/authcontroller');
let{createReservation,getCheckoutSession,getUserReservation} = require('../controller/reservationController');


reservationRouter.use(protectRoute)

reservationRouter
.route('/checkoutsession/:id')
.post(getCheckoutSession)


reservationRouter
.route('/:id')
.post(createReservation)

reservationRouter
.route('/getReservations')
.get(getUserReservation)



module.exports = reservationRouter;