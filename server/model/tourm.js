const dotenv = require('dotenv');
dotenv.config({path : './config.env'})

const dbConnection = process.env.DB_CONNECT;
const userModel = require('./userm');

const mongoose = require('mongoose');

mongoose.connect(dbConnection).then(function(db){
    console.log("tour db connected");
})
.catch(function(err){
    console.log(err);
    console.log("tour database not connected");

});

const tourSchema = mongoose.Schema({
    name:{
       type: String,
       required: true,
       unique:true,
       maxLength : [20,'plan name should not exceed than 20 characters']
    },
    duration:{
       type:String,
       required:true
    } ,
    Location:{
      type: String,
    required: true,
    },
    About: {
        type : String
    },
    price:{
       type:Number,
       required:[true,'price not entered']
    },
    ratingAverage:{
       type:Number,
       default: 0
    },
    discount:{
       type:Number,
       validate:[function(){
           return this.discount<100
       },'discount should not exceed price']
    },
    reviewNo:{
      type:Number,
      default: 0
    },
    photo :{
      type : String ,
      default : 'tourPage.jpg'
    },


    seheduleType :{
      type : String
    }
    }
   );
   
   /*
   tourSchema.pre(['save', 'findByIdAndUpdate'],async function(next){
      console.log('inside pop')
      console.log(this) 
      if (this.manager && this.isModified('manager')) {
         console.log('inside pop')
         // Perform the population of the manager field
         await this.populate('manager')
       }
       next();
   });
*/
   const tourModel = mongoose.model('tourModel',tourSchema);
   module.exports = tourModel ;
