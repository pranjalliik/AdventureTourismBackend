const showModel = require('../model/showm')


module.exports.createShow= async function createShow(req,res){
  try{
    console.group('createShow')
        let id  = req.params.id;
           
        let slotData = {};
        slotData.tour = id
        slotData.capacity = req.body.capacity;

        const showdate = new Date(req.body.year, req.body.month, req.body.day, req.body.hours, req.body.min );
        
       slotData.date = showdate;

       console.log(showdate)
       
       const formattedDate = showdate.toLocaleString(); // This will format the date in your local time zone
        console.log(formattedDate);

        let showCreated = await showModel.create(slotData);
        return  res.json({
            message : "show created",
           data: showCreated
        })
    }
    catch(err){
        console.log(err)
        return res.json({
            message: err.message
        })
    }
    


}

module.exports.allShow= async function allShow(req,res){
try{
    let tourId = req.params.id;
  let show = await showModel.find({ tour: tourId }).sort({ date: 1 })

    return  res.json({
        message : "All show ",
       data: show
    })
}
catch(err){
    return res.json({
        message: err.message
    })
}


}

module.exports.updateShow= async function updateShow(req,res){
    try{
        console.log('update show')
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
        console.log(dataToBeUpdated.date.toLocaleString())

        let show = await showModel.findByIdAndUpdate(id, dataToBeUpdated, {
            new: true, // Return the updated document
            runValidators: true // Run Mongoose schema validators on update
          });

          return  res.json({
            message : "updated show ",
           data: show
        })
    }catch(err){
        return res.json({
            message: err.message
        })
    }
}


module.exports.deleteShow = async function deleteShow(req,res){
    try{
        console.log('deleteshow')
        let id = req.params.id
        let deleteshow = await showModel.findByIdAndDelete(id);
        return  res.json({
            message : "show DELETED",
            data: deleteshow
        })
    }catch(err){
        return res.json({
            message: err.message
        })
    }
}