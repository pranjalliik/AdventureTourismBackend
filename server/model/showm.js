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
    required : [true,'show must belong to toue']
     
},

date : {
    type : Date,

},



capacity : {
    type : Number
},
capacityLeft : {
    type : Number,
    
},
currCapacity : {
    type : Number,
    
},
expireAt : {
    type: Date,
    index: { expires: 0 } 
}

},
{
    toJSON : { virtuals : true},
    toObject : { virtuals : true}
}
)

const showModel = mongoose.model('showModel',showSchema);
module.exports = showModel ;


