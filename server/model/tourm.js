const dbConnection ='mongodb+srv://kaushikpranjali7:2002@cluster0.tngl5ld.mongodb.net/?retryWrites=true&w=majority'
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
    },
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
    manager : Array
   });
   
   
   tourSchema.pre('save',async function(next){
    const guidesPromises = this.guides.map(async id => await userModel.findById(id))
    this.guides = await Promise.all(guidesPromises)
    next();
   });

   const tourModel = mongoose.model('tourModel',tourSchema);
   module.exports = tourModel ;
