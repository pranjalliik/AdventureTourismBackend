const tourModel = require('./tourm');
const userModel = require('./userm');

const dotenv = require('dotenv');
dotenv.config({path : './config.env'})

const dbConnection = process.env.DB_CONNECT;
const mongoose = require('mongoose');

mongoose.connect(dbConnection).then(function(db){
    console.log("review db connected");
})
.catch(function(err){
    console.log(err);
    console.log("review database not connected");

});

const reservationSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'userModel',
        required : [true,'review must belong to user']
         
    },
    show : {
        type : mongoose.Schema.ObjectId,
        ref : 'showModel',
        required : [true,'review must belong to a plan']

    },
    date : {
        type : Date,
    },

  reviewed :{
  type : Boolean,
  default : false
  
  },
     
    tour : {
    type : mongoose.Schema.ObjectId,
    ref : 'tourModel', 
    },
    amount :  {
        type : Number
    }
});



const reservationModel = mongoose.model('reservationModel',reservationSchema);
module.exports = reservationModel ;

