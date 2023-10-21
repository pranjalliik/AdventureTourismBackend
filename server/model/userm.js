const dbConnection ='mongodb+srv://kaushikpranjali7:2002@cluster0.tngl5ld.mongodb.net/?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require('crypto')
/*const validator = require("email-validator");

const crypto = require("crypto-js");*/

mongoose.connect(dbConnection).then(function(db){
    console.log("user db connected");
})
.catch(function(err){
    console.log(err);
    console.log("user database not connected");

});


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true ,
      /*  validate: function(){
            return  validator.validate(this.email) ;
        }*/
    },
    password:{
        type:String,
        required:true,
        select :false
    },
    confirmPassword:{
        type:String,
       required:true,

        validate: function(){
            return this.confirmPassword == this.password;
        }
    },
    role:{
        type:String,
        enum:['admin','user','manager'],
        default:'user'
    },
   resetToken : String,
   passwordresetexpires : Date,
});

userSchema.methods.createResetToken =async function(){
const resetToken =  crypto.randomBytes(32).toString("hex");
console.log('Generated Reset Token:', resetToken);
this.resetToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex'); 

                console.log('Hashed Reset Token:', this.resetToken);               
this.passwordresetexpires = Date.now() + 10 * 60 *1000;

return resetToken;

}

/*
userSchema.methods.resetpasswordHandler = function(password,confirmpassword){
this.password=password;
this.confirmPassword = confirmpassword
this.resetToken= undefined;
}*/

userSchema.pre('save',function(next){
      if(!this.isModified('confirmPassword')) return next();

    this.confirmPassword = undefined;
    next()
});


userSchema.pre('save', async function(next) {
 
   
    if(!this.isModified('password')) return next();
    console.log('check2') 
    const salt = await bcrypt.genSalt(saltRounds);
   const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  
});

 userSchema.methods.correctPassword = async function(
    candidatePassword,userPassword){
 

    let matched =   bcrypt.compareSync(candidatePassword,userPassword )
     return matched;
}


const userModel = mongoose.model('userModel',userSchema);

module.exports = userModel ;

