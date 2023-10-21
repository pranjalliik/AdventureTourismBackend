const userModel = require('../model/userm');


module.exports.getUser = async function createCourse(req,res){
    try{
        let users = await userModel.find();
        if(users){
            res.json({
            message:'user retrived',
            data:users
            })
        }
    }catch(err){
        return res.json({
            message: err.message
        })
    }


}

