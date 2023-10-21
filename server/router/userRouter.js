const express = require('express');
let userRouter = express.Router();
const {getUser} = require('../controller/usercontroller');
const {signUp,signin,signout,forgotpass,resetpass,protectRoute,isAuthorized,updatepass} = require('../controller/authcontroller');


userRouter
.route('/forgotpassword')
.post(forgotpass)

userRouter
.route('/resetpassword/:token')
.patch(resetpass)

userRouter
.route('/signin')
.post(signin)


userRouter
.route('/signup')
.post(signUp)

userRouter.use(protectRoute)
userRouter
.route('/signout')
.post(signout)

userRouter
.route('/updatepassword')
.patch(updatepass)

userRouter.use(isAuthorized(['admin']))
userRouter
.route('/')
.get(getUser)





module.exports = userRouter;