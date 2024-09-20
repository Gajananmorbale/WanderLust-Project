if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpresssError.js");

const session = require("express-session") //cookie
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const userRouter = require("./routes/user.js")

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate)


const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}




const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  
  touchAfter: 24 * 60 * 60, // 24 hours

})
store.on("error",()=>{
  console.log("Error in store")
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized: true,
    cookie:{
      expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
      httpOnly:true,
     // secure:true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    }
}




app.use(session(sessionOptions))
app.use(flash())

// Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 
app.use((req,res,next) =>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.currUser = req.user;
  next();
})




app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)     //   routes
app.use("/",userRouter)





//page not found rout
app.all("*",(req,res,next)=>{
  next(new ExpressError(404, "Page Not Found"));
})

// -------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------

//  Express Middleware
app.use((err,req,res,next)=>{
  let{statusCode=500,message="Somthing Went Wrong"}=err;

    res.status(statusCode).render("error.ejs",{message})
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});





