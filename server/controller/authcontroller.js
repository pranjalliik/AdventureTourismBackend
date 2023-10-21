const  userModel = require('../model/userm');
//const createResetToken  =  require('../model/userm');
const tourModel = require('../model/tourm');
const sendMail = require('../utils/email')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = "gyhuijofgratnmp9yn7rt1usnb73uihejkmse"
const saltRounds = 10;


const  signToken = id =>{
 return   jwt.sign({id },secret,{expiresIn: "60d"})
}


module.exports.signUp = async function signUp(req,res){
       console.log("signup");
                
    try{  
 
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
        console.log(req.user)
           res.status(200).json({
               
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
   catch(err){
       res.json({
               message: err.message,
               
       })
   }
   }
 

   module.exports.signin = async function signin(req,res){
         let {email,password} = req.body
 
         const user = await userModel.findOne({email}).select('+password');
 
         if(!user || !(await user.correctPassword(password,user.password))){
                return res.status(401).json({
                   message:'wrong credentialssss'
                   }) 
                 }else{
             const token = signToken(user._id);
         //    req.user = user;
               const cookieopt = {
               expires: new Date(
               Date.now() + 2 * 24 *60 * 60 *1000),httpOnly:true
      
               }
           res.cookie('jwt',token,cookieopt)

             return res.status(200).json({
             message:'signin ',
             user : user,
             token
            }) 
            }

             }
             
   
   module.exports.isAuthorized =  function isAuthorized(roles) {
    
    return async function(req, res, next) {
      console.log("isauthorized")
      try {
        //console.log(req.user._id);
        console.log(roles);
        
        if (roles.includes(req.user.role)) {
          if(req.user.role === 'admin'){
            console.log("is authorized");
          next();
          }else  if(req.user.role === 'manager'){
           
            let tourId = req.params.id;
            let tour = await tourModel.findById(tourId); 
            let managerId = tour.manager;
            if(String(managerId[0]._id) === String(req.user._id)){
              console.log("manager is authorized");
              next();
            } else{
             console.log(managerId[0]._id);
             console.log(req.user._id);

              res.status(401).json({
                message: "manager not allowed"
              });
            }

          }
        } else {
          console.log('you not allowed')

          res.status(401).json({
            message: "not allowed"
          });
        }
      } catch (err) {
        console.log(err)
        res.status(500).json({
          message: err.message
        });
      }
    };
   }

   

   module.exports.protectRoute = async function protectRoute(req,res,next){
    console.log("protect")
 
    try{
    console.log(req.cookies)
        if(!req.cookies.jwt){
          return res.status(401).json({
            message:'token not present'
          }) }

          let token = req.cookies.jwt
   
   

// token veriication

const decoded = jwt.verify(token, secret);
console.log(decoded)

// check if user still exists
const fuser = await userModel.findById(decoded.id)
console.log(fuser)
if(!fuser){
    return res.status(401).json({
        message:'user no longer exists'
    }) 
}

req.user = fuser

next();
    }catch(err){
      return res.json({
          message: err.message
      })
  }
   }


   module.exports.signout =  function logout(req,res){
    console.log("signout");

    try{
    res.cookie('jwt',' ',{maxAge:1});
    res.json({
     message: "logged out"
    })}catch(err){
      message : err.message
    }
          }


module.exports.forgotpass =async function forgotpass(req,res){
  try{
    console.log(req.body.email)
    const email = req.body.email;
    const user = await userModel.findOne({email})
    
    
    if(!user){
      res.json({
        message: "user not preseent"
      })
    }

    let token = await user.createResetToken();


  
      await user.save({validateBeforeSave :false})
    console.log('vbnm')

    const reseturl = `localhost:3000/users/resetpassword/${token}` ;

    const msg = ` link ${reseturl}`
 try{
    await sendMail({
      email : user.email,
      subject : 'reset your password',
      msg
    })
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

module.exports.resetpass =async function resetpass(req,res){
try{
 console.log('ayee') 
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
   Date.now() + 2 * 24 *60 * 60 *1000),httpOnly:true
 
}
res.cookie('jwt',token,cookieopt)
      res.json({
        message: "password set",
        token : token
      })

}catch(err){
  res.json({
    message: err.message,
    
})
}

}


module.exports.updatepass =async function resetpass(req,res){
  try{
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
      console.log(req.user)
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


  }catch(err){
      return res.json({
          message: err.message
      })
  }

}