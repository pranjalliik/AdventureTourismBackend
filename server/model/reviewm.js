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

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true,'review is required']
    },
    rating:{
        type: Number,
        min:1,
        max:10,
        required:[true,'rating is required']
    },
    createdAt:{

        type:Date,
        default: Date.now()
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'userModel',
        required : [true,'review must belong to user']
         
    },
    tour : {
        type : mongoose.Schema.ObjectId,
        ref : 'tourModel',
        required : [true,'review must belong to a plan']

    }
});

// find findById findOnne

reviewSchema.pre(/^find/,function(next){
    this.populate("user").populate("tour");
    next();
})

const reviewModel = mongoose.model('reviewModel',reviewSchema);
module.exports = reviewModel ;

