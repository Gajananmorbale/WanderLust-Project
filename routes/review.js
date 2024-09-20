const express = require("express");
const router = express.Router({mergeParams:true});       ///     parent

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpresssError.js");
const Listing = require("../models/listing.js")
const{validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")


const Review = require("../models/review.js")

const reviewController = require("../controllers/reviews.js")




// Reviews
// post rout

router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview))
  
  // Delete Review route   
   router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

  module.exports=router;