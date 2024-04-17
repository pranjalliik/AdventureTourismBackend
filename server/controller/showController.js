const showModel = require('../model/showm')
const catchAsync = require('./../utils/catchAsync');


exports.createShow= catchAsync(async (req,res,next)=>{
 
    console.group('createShow')
        let id  = req.params.id;
           
        let slotData = {};
        slotData.tour = id
        slotData.capacity = req.body.capacity;
        let showdate ;
        if(req.body.scheduleType === 'hourWise'){
        showdate = new Date(req.body.year, req.body.month, req.body.day, req.body.hours, req.body.min );
        }else{
            showdate = new Date(req.body.year, req.body.month, req.body.day );
        }
       slotData.date = showdate;
       slotData.expireAt = showdate
       console.log(showdate)
       
       const formattedDate = showdate.toLocaleString(); // This will format the date in your local time zone
        console.log(formattedDate);

        let showCreated = await showModel.create(slotData);
        return  res.status(200).json({
            message : "show created",
           data: showCreated
        })
})

exports.allShow= catchAsync(async (req,res,next)=>{
    let tourId = req.params.id;
  let show = await showModel.find({ tour: tourId }).sort({ date: 1 })

    return  res.json({
        message : "All show ",
       data: show
    })
})

exports.updateShow= catchAsync(async (req,res,next)=>{
        console.log('update show', req.body)
        let id = req.params.id;
        let dataToBeUpdated = {}
        const entries = Object.entries(dataToBeUpdated);

        if(req.body.hasOwnProperty('hours') || req.body.hasOwnProperty('min')){
            const showdate = new Date(req.body.year, req.body.month, req.body.day, req.body.hours, req.body.min );
            dataToBeUpdated.date = showdate;
        }
        if(req.body.hasOwnProperty('capacity')){
            dataToBeUpdated.capacity = req.body.capacity;
        }
      console.log(dataToBeUpdated) 

        let show = await showModel.findByIdAndUpdate(id, dataToBeUpdated, {
            new: true, // Return the updated document
            runValidators: true // Run Mongoose schema validators on update
          });
 console.log(show)
          return  res.json({
            message : "updated show ",
           data: show
        })
})


exports.deleteShow = catchAsync(async(req,res,next)=>{
        console.log('deleteshow')
        let id = req.params.id
        let deleteshow = await showModel.findByIdAndDelete(id);
        return  res.json({
            message : "show DELETED",
            data: deleteshow
        })
    
}) 


exports.getShow = catchAsync(async(req,res,next)=>{

       let id = req.params.id;
           console.log(id);

let show = await showModel.findById(id);
console.log("byee")
if(show){
  return  res.json({
        message : "show",
        data: show
    })
}else{
    return  res.json({
        message : "no show found",

    })
}


}

)