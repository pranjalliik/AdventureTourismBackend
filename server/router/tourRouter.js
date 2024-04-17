
const express = require('express');
let tourRouter = express.Router();
let multer = require('multer')
const {updatephoto, tourSales, tourMonthlySale, createtour,alltour,deletetour,updatetour,gettour,uploadTourPhoto,allthreetour,getAdmintour} = require('../controller/tourcontroller');
let{protectRoute,isAuthorized,uploaduserphoto} = require('../controller/authcontroller');
const upload = multer({dest:'uploads/'})


tourRouter.get('/',alltour)

tourRouter.get('/topthree',allthreetour)



tourRouter.get('/monthlysales',protectRoute,isAuthorized(['admin']),tourMonthlySale)
tourRouter.get('/toursales',protectRoute,isAuthorized(['admin']),tourSales)
tourRouter.get('/:id',gettour)


tourRouter.patch('/crud/:id',protectRoute,isAuthorized(['admin']),updatetour)

tourRouter.patch('/updatephoto/:id',protectRoute,isAuthorized(['admin']),uploadTourPhoto,updatephoto)




tourRouter.post('/crud',protectRoute,isAuthorized(['admin']),uploadTourPhoto,createtour)


tourRouter.delete('/crud/:id',protectRoute,isAuthorized(['admin']),deletetour)




module.exports = tourRouter;