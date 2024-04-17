const express = require("express");
const router = express.Router({mergeParams: true});
const listing = require("../modals/listing.js");
const review = require("../modals/review.js");
const { isLoggedIn,validateReview, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");


//review route...
router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
  module.exports = router;