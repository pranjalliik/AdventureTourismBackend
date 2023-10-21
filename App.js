const courseModel = require('./server/model/tourm');
const userModel = require('./server/model/userm');
const cors = require('cors');
const express =  require("express");
const dotenv = require('dotenv');
dotenv.config({path : './config.env'})

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

//console.log(process.env)

const cookieParser = require('cookie-parser');

// Middleware to parse cookies
app.use(cookieParser());
app.use(express.json());


app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
//const AppError = require('./server/utils/appError')
const globalErrorHandler = require('./server/controller/errorController')
let tourRouter = require('./server/router/tourRouter');
let userRouter = require('./server/router/userRouter');
let reviewRouter = require('./server/router/reviewRouter');
let showRouter = require('./server/router/showRouter');
let reservationRouter = require('./server/router/reservationRouter');


app.use('/tours',tourRouter);
app.use('/users',userRouter);
app.use('/reviews',reviewRouter);
app.use('/slots',showRouter);
app.use('/book',reservationRouter);

//app.all('*',(req,res,next) =>{
/*const err = new Error('cannot find url on this server')
err.status = 'fail',
err.statusCode = 404;*/
//next(new AppError('cannot find url on this server',404));
//})


//app.use(globalErrorHandler)