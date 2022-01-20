const express = require("express"); // express 
const mongoose = require("mongoose"); // mongoose
const cors = require("cors");  // cors
const app = express();  // express aspp
const session = require('express-session')// express-session
const bodyParser = require("body-parser"); // body parser 
const expressLimit = require("express-limit").limit;
const MongoDBStore = require('connect-mongodb-session')(session); // connect-mongodb-session 
const timeout = require('connect-timeout');// timeout midleware
const helmet = require('helmet')
//routes requires
const usersRouter = require("./routes/users"); 
const userFollowing = require("./routes/user_following"); 
const newsFeed = require("./routes/newsfeed"); 
const signupRouter = require("./routes/signup"); 
const loginRouter = require("./routes/login"); 
const logoutRouter = require("./routes/logout"); 
const postsRouter = require("./routes/posts");
const activitiesRouter = require("./routes/activities");
const categoriesRouter = require("./routes/categories");
const commentsRouter = require("./routes/comments");
const likesRouter = require("./routes/likes");
const invitesRouter = require("./routes/invites");
const repliesRouter = require("./routes/replies");
const repostsRouter = require("./routes/reposts");
const uploadsRouter = require("./routes/uploads");
const messagesRouter = require("./routes/messages");
const notificationsRouter = require("./routes/notifications");
const viewsRouter = require("./routes/views");
const ratingsRouter = require("./routes/ratings");
const sharesRouter = require("./routes/shares");
const trashRouter = require("./routes/trash");
const searchRouter = require("./routes/search");
const dotenv = require('dotenv');
dotenv.config(); // load environmental variables
const env_config = require('../env_config');
env_config.config() // load NODE_ENVIRONMENTAL variables
//routes requires endline

// get the environmental variables
const PORT = process.env.PORT || 1000; 
const SESSION_BD_URI = process.env.SESSION_BD_URI
const SESSION_DB_COLLECTION = process.env.SESSION_DB_COLLECTION
const NODE_ENV = process.env.NODE_ENV
const SESSION_SECRET = process.env.SESSION_SECRET
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const ROOTPATH =  process.env.ROOTPATH 
const STATIC_FOLDER_NAME = process.env.STATIC_FOLDER_NAME

require('events').EventEmitter.prototype._maxListeners = 1000000;

/* create a sessions store*/
const store = new MongoDBStore({uri: SESSION_BD_URI, collection: SESSION_DB_COLLECTION})

// SEVER RUNNING ON ENVIRONMENT PORT OR 1000
const server = app.listen(PORT,()=>{
    console.log("\x1b[36m api running on a \x1b[32m"+NODE_ENV+" \x1b[36m environment, on port \x1b[34m"+PORT+"\x1b[37m");
    store.on("open",()=>{
      console.log("session database connection established");
    })
    store.on("data", function(){
      store.removeAllListeners();
    })
});
console.log(ROOTPATH)
server.timeout = 60 * 60 * 1000;
server.keepAliveTimeout = 60 * 60 * 1000;
server.headersTimeout = 60 * 60 * 1000;

// EXPRESS MIDDLEWARE USAGE

/* secured headers */
app.set('trust proxy', 1) // trust first proxy
/* express router | all routes */

/* CORS (Cross Origin Requests Handling) */
const corsOptions = {
  origin:true,
  credentials: true
};


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  if (req.method === "OPTIONS") {
      return res.status(200).end();
  } else {
      next();
  }
});
app.use(cors(corsOptions));

// create a session 
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  store: store,
  cookie: {
    secure: false,
    httpOnly: false, 
    maxAge: Date.now() + (30 * 86400 * 1000)
  },
  name: 'session cookie for aydinty',
}));

/* body parser */
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.json({
  type: function(req) {
      return req.get('content-type').indexOf('multipart/form-data') !== 0;
  },
}));
// parse body here to check access_token from post requests
  /* CHECK FOR ACCESS TOKEN, IMPORTANT SECURITY MEASURE */
app.use(function(req,res,next){
    let req_access_token;
    if(req.path.startsWith("/public")){ // go next if req is for static files
      next();
    }
    // if a get request
    if(req.method === "GET"){
      const reqQuery = req.query;
      if(!reqQuery.hasOwnProperty("access_token")){
        return res.status(403).send("forbidden");
      }
      req_access_token =  reqQuery.access_token;
    }
    // if a post request
    if(req.method === "POST"){
      const reqBody = req.body;
      if(!reqBody.hasOwnProperty("access_token")){
        return res.status(403).send("forbidden");
      }
      req_access_token =  reqBody.access_token;
    }
    // if access token is wrong, request is forbidden
    if(req_access_token !== ACCESS_TOKEN){
      return res.status(403).send("forbidden");
    }
    next();
});

/* get logged in user */
app.get("/user_status", (req,res,next)=>{
    if(req.session.hasOwnProperty("loggedInUser")){
      const loggedInUser = req.session.loggedInUser;
      const loggedUserName = loggedInUser.username;
      res.send({
        isLoggedIn: true,
        loggedInUser: loggedInUser,
        loggedUserName: loggedUserName
       });
   }
   else{
     res.send({ isLoggedIn: false });
   }
});

app.get("/",(req,res,next)=>{
    if(req.session.hasOwnProperty("loggedInUser")){
        console.log("user logged in");
    }
    else{
        console.log("user logged out");
    }
    res.end();
});  


/* static folder */
app.use(express.static(ROOTPATH+STATIC_FOLDER_NAME));

/* secured headers */
app.use(helmet());

/* express file upload limit */
app.use(expressLimit({
  max :1000,                  // Maximum request per period
  period : 60 * 1000,           // Period in milliseconds
  prefix :'rate-limit-',       // Prefix of the key
  status : 429,                 // Status code in case of rate limit reached
  message : 'Too many requests', // Message in case of rate limit reached
  identifier : request => {         // The identifier function/value of the key (IP by default, could be "req.user.id")
      return request.ip || request.ips; // Read from Default properties
  },
  headers : {                       // Headers names
      remaining: 'X-RateLimit-Remaining',
      reset:     'X-RateLimit-Reset',
      limit:     'X-RateLimit-Limit'
  }             
}));

// REGISTERING ROUTES
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/posts', postsRouter);
app.use('/activities', activitiesRouter);
app.use('/categories', categoriesRouter);
app.use('/comments', commentsRouter);
app.use('/likes', likesRouter);
app.use('/invites', invitesRouter);
app.use('/replies', repliesRouter);
app.use('/reposts', repostsRouter);
app.use('/uploads', uploadsRouter);
app.use('/messages', messagesRouter);
app.use('/notifications', notificationsRouter);
app.use('/views', viewsRouter);
app.use('/ratings', ratingsRouter);
app.use('/shares', sharesRouter);
app.use("/user_following", userFollowing);
app.use("/newsfeed", newsFeed);
app.use("/trash", trashRouter);
app.use("/search", searchRouter);







