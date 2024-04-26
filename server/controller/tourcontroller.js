const tourModel = require('../model/tourm');
const reservationModel = require('../model/reservationm');

const multer = require('multer')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError')

const multrtStorage = multer.diskStorage({
destination : (req,file,cb) =>{
    cb(null,'client/src/images')
},
filename :(req,file,cb) =>{
    const ext = file.mimetype.split('/')[1]
    cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
}
})

const multerFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new AppError('Not an img',400),false) // err status also
    }
}

const upload = multer({
    storage: multrtStorage,
    fileFilter : multerFilter
})

exports.uploadTourPhoto = upload.single('photo');




exports.createtour = catchAsync(async(req,res,next)=>{
    try{
      
        let tourData = req.body;
        if(req.file) tourData.photo = req.file.filename
        let tour = await tourModel.create(tourData);
        return  res.json({
            message : "tour created",
           data: tour
        })
    }
    catch(err){
        return res.json({
            message: err.message
        })
    }
    
})



exports.updatephoto = catchAsync(async(req,res,next)=>{

   
      let id = req.params.id;


      let tour = await tourModel.findById(id); 
      tour['photo'] = req.file.filename

 
      
      const updatedData = await tour.save();
    
 
        return  res.json({
         message : "tour updated",
        data: updatedData
        })
    })



exports.alltour = catchAsync(async (req, res, next) =>{
  
        let tour = await tourModel.find();
        if(!tour){
          next(new AppError('tours not found'))
           
        }

        res.status(200).json({
            message:'tour retrived',
            data:tour
            })
    
})



exports.tourMonthlySale = catchAsync(async (req, res, next) =>{
  
  const monthlySales = await reservationModel.aggregate([
    {
      $match: {
        // Match sales within the last year
        date: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
      }
    },
    {
      $project: {
        tour: 1,
        month: { $month: "$date" },
        year: { $year: "$date" },
        amount: 1
      }
    },
    {
      $group: {
        _id: { tour: "$tour", month: "$month", year: "$year" },
        totalSales: { $sum: "$amount" }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1
      }
    },
    {
      $project: {
        _id: 0,
        tour: "$_id.tour",
        month: "$_id.month",
        year: "$_id.year",
        totalSales: 1
      }
    }
  ]);
  

      for(let i=0;i<monthlySales.length;i++){
        let tid = monthlySales[i].tour
        monthlySales[i].tour = await tourModel.findById(tid).select('name')
      }
      
      

    res.status(200).json({
        message:'tour retrived',
        data: monthlySales
        })

})    








exports.allthreetour = catchAsync(async (req,res,next)=>{
    
        let tour = await tourModel.find();
        const firstThreeElements = tour.slice(0, 4);
        if(tour){
            res.json({
            message:'tour retrived',
            data: firstThreeElements
            })
        }else{
            res.json({
                message:'tour not found',
                })
        }

}
)

exports.deletetour = catchAsync (async(req,res,next)=>{
  
        let id = req.params.id;
        let deletedtour = await tourModel.findByIdAndDelete(id);
        return  res.json({
            message : "tour DELETED",
            data: deletedtour
        })

}
)

exports.updatetour = catchAsync( async(req,res,next)=>{
    
        let id = req.params.id;
        let dataToBeUpdated = req.body;
        let keys = [];
        let tour = await tourModel.findById(id); 

        for(let key in dataToBeUpdated){
            keys.push(key);
        }
       
        

        for(let i=0;i<keys.length;i++){
          tour[keys[i]] = dataToBeUpdated[keys[i]];
        }
        
        const updatedData = await tour.save();
     /*   const updatedTour = await tourModel.findByIdAndUpdate(id, dataToBeUpdated, {
            new: true, // Return the updated document
            runValidators: true // Run Mongoose schema validators on update
          });
        */

       return  res.json({
        message : "plan updated",
       data: updatedData
    })
   
})

exports.gettour = catchAsync(async (req,res,next)=>{
   
       let id = req.params.id;

let tour = await tourModel.findById(id);

if(!tour){
    next(new AppError('tours not found',404))
     
  }

  return  res.json({
        message : "all tour",
        data: tour
    })



}
)



exports.getAdmintour = catchAsync(async (req,res,next)=>{

        let id = req.user._id;

           

let tour = await tourModel.find({manager : id});
if(tour){
  return  res.json({
        message : "all tours og admin",
        data: tour
    })
}else{
    return  res.json({
        message : "no tour found",

    })
}


})



exports.tourSales = catchAsync(async (req, res, next) =>{

  let salesData = await reservationModel.find().populate('tour');
  const salesByTour = {};
  salesData.forEach(sale => {
      const tourName = sale.tour.name;
      const saleAmount = sale.amount;
      salesByTour[tourName] = (salesByTour[tourName] || 0) + saleAmount;
  })
  res.status(200).json({
    message:'tour retrived',
    data: salesByTour
    })

})