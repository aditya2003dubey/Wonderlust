if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path")
const engine = require('ejs-mate')
const app = express();
app.use(express.urlencoded({extended:true}));
const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modals/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js");



app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.use(express.static("public"));
app.engine('ejs', engine);

const dbUrl = process.env.ATLASDB_URL;

//database setup
main()
.then(()=>{
    console.log("database working");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error",() =>{
  console.log("ERROR in MONGO SESSION STORE",err);
});

// sessionoption
const sessionOption = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie: {
   expires: Date.now() + 1000*60*60*24*3,
    maxAge: 1000*60*60*24*3,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



//routing --
app.use("/listing" , listingRouter);
app.use("/listing/:id/reviews" ,reviewRouter);
app.use("/", userRouter);

app.all("*",(req,res,next) =>{
  next(new ExpressError(404,"Page Not Found!"))
})

app.use((err,req,res,next)=>{
  let {statusCode = 500, message = "something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});
})




app.listen(8080, ()=>{
    console.log("server is working");
});