const express = require("express");
const router = express.Router();
const listing = require("../modals/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

router.route("/:id")
.put(isLoggedIn,isOwner,validateListing,upload.single("listing[image]"),wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.showListing));
  
  //edit route
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
  
  
  //delete route
  router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

  module.exports= router;