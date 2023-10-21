const reservationModel = require('../model/reservationm')
const showModel = require('../model/showm')


module.exports.createReservation = async function createReservation(req,res){
    try{
        console.log(req.body)
        let show  = req.params.id;
        let reserData = req.body;
        reserData.show = show
       reserData.user= req.user._id
       let  showData = await showModel.findById(show);
        
       if(showData.capacity === showData.currCapacity){
        return  res.json({
            message : "housefull",
         
        })
       }

        let showCreated = await reservationModel.create(reserData);
         showData.capacity =  showData.capacity+1;
         const updatedShow = await tourModel.findByIdAndUpdate(show,showData)
         
        return  res.json({
            message : "booking created",
           data: showCreated,
           dataShow : updatedShow
        })
    }
    catch(err){
        return res.json({
            message: err.message
        })
    }

}
