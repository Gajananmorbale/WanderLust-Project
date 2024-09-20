const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js")
const{isLoggedIn,isOwner, validateListing} = require("../middleware.js");
const { index,renderNewForm,showListing,createListing,editListing,updateListing,deleteListing } = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage})

// index rout        // Create Rout          utils file provide wrapAsync function
router.route("/").
get(wrapAsync(index)).
post(isLoggedIn,upload.single("listing[image]"),wrapAsync (createListing));


 // New Rout 
 router.get("/new", isLoggedIn,renderNewForm)

// Show rout  ////Update Route   //Delete Rout
router.route("/:id").
get(wrapAsync(showListing)).
put(isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(updateListing)).
delete(isLoggedIn,isOwner,wrapAsync(deleteListing));


  
  
  // edit Route
  
  router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(editListing));


  module.exports=router;