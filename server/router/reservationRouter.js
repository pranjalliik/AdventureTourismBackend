const express = require('express');
let reservationRouter = express.Router();

let{protectRoute,isAuthorized} = require('../controller/authcontroller');
let{createReservation} = require('../controller/reservationController');


//reservationRouter.use(protectRoute)

reservationRouter
.route('/:id')
.post(createReservation)





module.exports = reservationRouter;