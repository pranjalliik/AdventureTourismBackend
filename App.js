const courseModel = require('./server/model/tourm');
const userModel = require('./server/model/userm');
const AppError = require('./server/utils/appError');


const cors = require('cors');
const express =  require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
const compression = require('compression');



process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
 





dotenv.config({path : './config.env'})

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Custom middleware to log request information
const logRequestInfo = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
};

// Use the custom middleware for all routes
app.use(logRequestInfo);

const cookieParser = require('cookie-parser');
app.use(morgan('dev'));

// Middleware to parse cookies
app.use(cookieParser());
app.use(express.json());
app.use(compression());

const port = process.env.P0RT || 5000
const server =  app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
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
 
app.all('*',(req,res,next) =>{
/*const err = new Error('cannot find url on this server')
err.status = 'fail',
err.statusCode = 404;*/
next(new AppError('cannot find url on this server',404));
})

app.use(globalErrorHandler) 
