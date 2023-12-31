const tourModel = require('./tourm');
const userModel = require('./userm');

const dotenv = require('dotenv');
dotenv.config({path : './config.env'})

const dbConnection = process.env.DB_CONNECT;
const mongoose = require('mongoose');

mongoose.connect(dbConnection).then(function(db){
    console.log("show db connected");
})
.catch(function(err){
    console.log(err);
    console.log("show database not connected");

});

const showSchema = new mongoose.Schema({

    tour :   
      {
    type : mongoose.Schema.ObjectId,
    ref : 'tourModel',
    required : [true,'review must belong to user']
     
},

date : {
    type : Date,

},



capacity : {
    type : Number
},
currCapacity : {
    type : Number,
    default : 0
}

},
{
    toJSON : { virtuals : true},
    toObject : { virtuals : true}
}
)

const showModel = mongoose.model('showModel',showSchema);
module.exports = showModel ;


