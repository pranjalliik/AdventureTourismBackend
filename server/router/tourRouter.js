
const express = require('express');
let tourRouter = express.Router();
let multer = require('multer')
const {createtour,alltour,deletetour,updatetour,gettour,uploadTourPhoto,allthreetour} = require('../controller/tourcontroller');
let{protectRoute,isAuthorized,uploaduserphoto} = require('../controller/authcontroller');
const upload = multer({dest:'uploads/'})


tourRouter
.route('/')
.get(alltour)

tourRouter
.route('/topthree')
.get(allthreetour)


tourRouter
.route('/:id')
.get(gettour)

tourRouter.use(protectRoute)
tourRouter
.route('/crud/:id')
.patch(isAuthorized(['admin','manager']),updatetour)



tourRouter.use(isAuthorized(['admin']));
tourRouter
.route('/crud')
.post(uploadTourPhoto,createtour)

tourRouter
.route('/crud/:id')
.delete(deletetour)



module.exports = tourRouter;