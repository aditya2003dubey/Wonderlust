const listing = require("../modals/listing");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema.js");
module.exports.index = async (req,res)=>{
    let allListing =await listing.find({});
    res.render("index.ejs", {allListing})
};

module.exports.renderNewForm = (req,res)=>{
    res.render("new.ejs");
  };

  module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let searchListing = await listing.findById(id).populate({path: "reviews",populate: {path:"author",},})
    .populate("owner");
    if(!searchListing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listing");
    }
    res.render("show.ejs", {searchListing})
  };

  module.exports.createListing = async (req,res)=>{
    
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listing");
};

module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params;
    const listingg = await listing.findById(id);
    if(!listingg){
      req.flash("error","listing you requested for does not exist!");
      res.redirect("/listing");
    }

    let originalImageUrl = listingg.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
    
    res.render("editt.ejs",{listingg,originalImageUrl});
  };

  module.exports.updateListing = async (req,res)=>{
    
    let {id} = req.params;
     let Listing = await listing.findByIdAndUpdate(id,{...req.body.listing});
    
     if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     Listing.image ={url,filename};
     await Listing.save();
     }

     req.flash("success","Listing Updated!");
      res.redirect(`/listing/${id}`);
  };

  module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listing");
  };