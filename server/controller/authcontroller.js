const  userModel = require('../model/userm');
 const createResetToken  =  require('../model/userm');
const tourModel = require('../model/tourm');
const Email = require('../utils/email')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError')
const secret = "gyhuijofgratnmp9yn7rt1usnb73uihejkmse"
const saltRounds = 10;


const  signToken = id =>{
 return   jwt.sign({id },secret,{expiresIn: "60d"})
}

exports.signUp = catchAsync(async(req,res,next)=>{
                
       let user = await userModel.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword,
       });
        
       const token = signToken(user._id)
       const cookieopt = {
        expires: new Date(
          Date.now() + 2 * 24 *60 * 60 *1000),httpOnly:true
        
      }
   res.cookie('jwt',token,cookieopt)
  
       if(user){

        let data = {
          email : user.email,
          name : user.name
        }

           res.status(200).json({
               
               message:"user signed up",
               data,
               cookieopt,
               token
           })
       }
       else{
           res.json({
               message:"error "
           })
       }
  
   })
 
   exports.signin = catchAsync(async(req,res,next)=>{
         let {email,password} = req.body
 
         const user = await userModel.findOne({email}).select('+password');
 
         if(!user || !(await user.correctPassword(password,user.password))){
                return res.status(401).json({
                   message:'wrong credentials'
                   }) 
                 }else{
             const token = signToken(user._id);
               const cookieopt = {
               expires: new Date(
               Date.now() + 60 * 24 *60 * 60 *1000),httpOnly:true
      
               }
           res.cookie('jwt',token,cookieopt)
           
             return res.status(200).json({
             message:'signin ',  
             user : user,
             token,
             cookieopt
            }) 
            }

             })
             
   
   module.exports.isAuthorized =  function isAuthorized(roles) {
    
    return async function(req, res, next) {
      try {
        //console.log(req.user._id);
        
        if (roles.includes(req.user.role)) {
          if(req.user.role === 'admin'){
          next();
          }else  if(req.user.role === 'manager'){
           
            let tourId = req.params.id;
            let tour = await tourModel.findById(tourId); 
            let managerId = tour.manager;
            if(String(managerId[0]._id) === String(req.user._id)){
              next();
            } else{
        

              res.status(401).json({
                message: "manager not allowed"
              });
            }

          }
        } else {

          res.status(401).json({
            message: "not allowed"
          });
        }
      } catch (err) {
        res.status(500).json({
          message: err.message
        });
      }
    };
   }

   

   module.exports.protectRoute = catchAsync(async (req, res, next) => {


   console.log(JSON.stringify(req.cookies) +'<-cookies obj')
        if(!req.cookies.jwt){
          return res.status(401).json({
            message:'token not present'
          }) }

          let token = req.cookies.jwt

   

// token veriication

const decoded = jwt.verify(token, secret);
//console.log(decoded)

// check if user still exists
const fuser = await userModel.findById(decoded.id)
//console.log('user info-> ', fuser)
if(!fuser){
    return res.status(401).json({
        message:'user no longer exists'
    }) 
}

req.user = fuser

next();
   
   })

   exports.signout = catchAsync(async(req,res,next)=>{

    res.cookie('jwt',' ',{maxAge:1});
    res.json({
     message: "logged out"
    })
          })


module.exports.forgotpass =async function forgotpass(req,res){
  try{
    
    const email = req.body.email;
    const user = await userModel.findOne({email})
    
    
    if(!user){
      res.json({
        message: "user not preseent"
      })
    }

    let token = await user.createResetToken();


  
      await user.save({validateBeforeSave :false})
    try {
    const reseturl = `localhost:3000/users/resetpassword/${token}` ;

    const msg = ` link ${reseturl}`

    await new Email(user, reseturl).sendPasswordReset();
    res.status(200).json({
      message: "mail sent to user"
    })
  }catch(err){
    user.resetToken = undefined
    user.passwordresetexpires = undefined
    await user.save({ validateBeforeSave : false})
    res.json({
      message: err.message,
      
})
  }
  }catch(err){
    res.json({
      message: err.message,
      
})
  }
}

exports.resetpass = catchAsync(async(req,res,next)=>{

  let resetToken = req.params.token
  hashedtoken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex'); 

  const user = await userModel.findOne({resetToken :hashedtoken,
    passwordresetexpires : {$gt : Date.now()}
  });
  
  if(!user){
    return res.json({
      message:'token expired'
      }) 
  }

//

  user.password = req.body.password,
  user.confirmPassword = req.body.confirmPassword,
  user.resetToken = undefined
  user.passwordresetexpires = undefined
  await user.save()

const token = signToken(user._id)
const cookieopt = {
 expires: new Date(
   Date.now() + 10 * 24 *60 * 60 *1000),httpOnly:true
 
}
res.cookie('jwt',token,cookieopt)
      res.json({
        message: "password set",
        token : token
      })


})


exports.updatepass = catchAsync(async(req,res,next)=>{

      let {password} = req.body
      const user = await userModel.findOne({email : req.user.email}).select('+password');
      if(!user || !(await user.correctPassword(password,user.password))){
          return res.status(401).json({
             message:'wrong credentialssss'
             }) 
           }else{
              user.password = req.body.newpassword,
              user.confirmPassword = req.body.confirmPassword

              const updatedpassworduser = await user.save()
              const token = signToken(user._id)
     const cookieopt = {
      expires: new Date(
        Date.now() + 2 * 24 *60 * 60 *1000),httpOnly:true
      
    }
 res.cookie('jwt',token,cookieopt)

     if(updatedpassworduser){
         res.json({
             
             message:"user signed up",
             data: user,
             token
         })
     }
     else{
         res.json({
             message:"error "
         })
     }

 }
})
