const tourModel = require('./tourm');
const userModel = require('./userm');

const dbConnection ='mongodb+srv://kaushikpranjali7:2002@cluster0.tngl5ld.mongodb.net/?retryWrites=true&w=majority'

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


});



const reservationModel = mongoose.model('reservationModel',reservationSchema);
module.exports = reservationModel ;

