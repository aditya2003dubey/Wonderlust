const User = require("../modals/user")

module.exports.renderSignupForm = (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res) =>{
    try{
     let{username,email,password} = req.body;
     let newUser = new User({email,username});
     const registerUser = await User.register(newUser,password);
    req.login(registerUser,(err) => {
     if(err){
         return next(err);
     }
     req.flash("success","Welcome to Wonderlust");
     res.redirect("/listing");
    });
    }
    catch(err){
     req.flash("error",err.message);
     res.redirect("/signup")
    }
 };

 module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

 module.exports.login = async (req,res)=>{
    req.flash("success","Welcome to Wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listing"; 
 res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","you are succesfully log out");
        res.redirect("/listing");

    })
}

