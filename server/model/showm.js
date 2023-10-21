const tourModel = require('./tourm');
const userModel = require('./userm');

const dbConnection ='mongodb+srv://kaushikpranjali7:2002@cluster0.tngl5ld.mongodb.net/?retryWrites=true&w=majority'

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


