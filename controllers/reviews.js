const listing = require("../modals/listing");
const review = require("../modals/review");
const {reviewSchema} = require("../schema.js");

module.exports.createReview = async (req,res)=>{
  
  let {id} = req.params;
    console.log(id);
    let Listing = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
   newReview.author = req.user._id;
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    req.flash("success","New review created");
    res.redirect(`/listing/${id}`);
  };

  module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
  }