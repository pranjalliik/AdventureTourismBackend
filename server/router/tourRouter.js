
const express = require('express');
let tourRouter = express.Router();
let multer = require('multer')
const {createtour,alltour,deletetour,updatetour,gettour,uploadTourPhoto,allthreetour,getAdmintour} = require('../controller/tourcontroller');
let{protectRoute,isAuthorized,uploaduserphoto} = require('../controller/authcontroller');
const upload = multer({dest:'uploads/'})


tourRouter.get('/',alltour)

tourRouter.get('/topthree',allthreetour)






tourRouter.get('/admin',protectRoute,getAdmintour)
//tourRouter.use(protectRoute)
//isAuthorized(['admin','manager']),

tourRouter.get('/:id',gettour)





tourRouter
.route('/crud/:id') 
.patch(updatetour)



tourRouter.use(isAuthorized(['admin']));
tourRouter
.route('/crud')
.post(uploadTourPhoto,createtour)

tourRouter
.route('/crud/:id')
.delete(deletetour)



module.exports = tourRouter;