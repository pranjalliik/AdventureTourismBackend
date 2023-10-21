const tourModel = require('../model/tourm');
const multer = require('multer')

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




module.exports.createtour = async function createCourse(req,res){
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
    
}

module.exports.alltour = async function alltour(req,res){
    try{
        let tour = await tourModel.find();
        const cookieopt = {
        expires: new Date(
            Date.now() + 2 * 24 *60 * 60 *1000),httpOnly:true
          
        }
     res.cookie('test','123',cookieopt)
        if(tour){
            res.json({
            message:'tour retrived',
            data:tour
            })
        }else{
            res.json({
                message:'tour not found',
                })
        }
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}


module.exports.allthreetour = async function allthreetour(req,res){
    try{
        let tour = await tourModel.find();
        const firstThreeElements = tour.slice(0, 3);
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
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.deletetour = async function deletetour(req,res){
    try{
        let id = req.params.id;
        let deletedtour = await tourModel.findByIdAndDelete(id);
        return  res.json({
            message : "tour DELETED",
            data: deletedtour
        })
    }catch(err){
        return res.json({
            message: err.message
        })
    }
}

module.exports.updatetour = async function updatetour(req,res){
    try{
        let id = req.params.id;
        let dataToBeUpdated = req.body;
        let keys = [];
        let tour = await tourModel.findById(id); 
        console.log('olddata')
       console.log(dataToBeUpdated )
        for(let key in dataToBeUpdated){
            keys.push(key);
        }
       
        

        for(let i=0;i<keys.length;i++){
          tour[keys[i]] = dataToBeUpdated[keys[i]];
        }
        
        //const updatedData = await tour.save();
        const updatedTour = await tourModel.findByIdAndUpdate(id, dataToBeUpdated, {
            new: true, // Return the updated document
            runValidators: true // Run Mongoose schema validators on update
          });
        
          console.log(updatedTour  + "gjk")

       return  res.json({
        message : "plan updated",
       data: updatedTour
    })
    }
    catch(err){
        return res.json({
            message: err.message
        })
    }
}

module.exports.gettour = async function updatetour(req,res){
    try{
        console.log("gettour");
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
}catch(err){
    return res.status(500).json({
        message: err.message
    })
}

}