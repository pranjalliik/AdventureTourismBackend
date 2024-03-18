const tourModel = require('../model/tourm');
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
        console.log(req.file)
        console.log(req.body)
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


exports.alltour = catchAsync(async (req, res, next) =>{
  
        console.log('alltour')
        let tour = await tourModel.find();
        if(!tour){
          next(new AppError('tours not found'))
           
        }

        res.status(200).json({
            message:'tour retrived',
            data:tour
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
          console.log(updatedData  + "gjk")

       return  res.json({
        message : "plan updated",
       data: updatedData
    })
   
})

exports.gettour = catchAsync(async (req,res,next)=>{
   
        console.log("gettou at t he sunr");
       let id = req.params.id;
           console.log(id);

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

exports.gettour = catchAsync(async(req,res,next)=>{

    console.log("gettour i stay ");
       let id = req.params.id;
           console.log(id);

let tour = await tourModel.findById(id);
console.log("byee")
if(tour){
  return  res.json({
        message : "all tour",
        data: tour
    })
}else{
    return  res.json({
        message : "no tour found",

    })
}


}

)

exports.getAdmintour = catchAsync(async (req,res,next)=>{

        let id = req.user._id;
        console.log(id +'every');

        console.log("gettour kl,;");
           

let tour = await tourModel.find({manager : id});
console.log("byee")
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