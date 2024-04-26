
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
showRouter.post('/:id',protectRoute,isAuthorized(['admin','manager']),createShow)



showRouter.get('/show/:id',getShow)

showRouter.patch('/:id',protectRoute,isAuthorized(['admin','manager']),updateShow)

showRouter.delete('/:id',protectRoute,isAuthorized(['admin','manager']),deleteShow)

module.exports = showRouter;  


 
