
const express = require('express');
let showRouter = express.Router();

const {getShow,createShow,allShow,updateShow,deleteShow} = require('../controller/showController');
let{ protectRoute,isAuthorized,uploaduserphoto} = require('../controller/authcontroller')


showRouter
.route('/:id')
.get(allShow)
/*
showRouter.route('/:id1/:id2')
.get(getShow)
*/
//showRouter.use(protectRoute)
//showRouter.use(isAuthorized(['admin','manager']))
showRouter
.route('/:id')
.post(createShow)



showRouter.get('/show/:id',getShow)

showRouter.route('/:id')
.patch(updateShow)

showRouter
.route('/:id')
.delete(deleteShow)

module.exports = showRouter;  


 
