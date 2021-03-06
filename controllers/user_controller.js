const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = async function (req, res) {
  try {
    let myUser = await User.findById(req.params.id);

    if (req.user) {
      usersFriendships = await User.findById(req.user._id).populate({
        path: "friendships",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "from_user to_user",
        },
      });
    }
    let isFriend = false;
    for (Friendships of usersFriendships.friendships) {
      if (
        Friendships.from_user.id == myUser.id ||
        Friendships.to_user.id == myUser.id
      ) {
        isFriend = true;
        break;
      }
    }

    return res.render("user_profile", {
      title: "PROFILE",
      heading: "PROFILE PAGE",
      profile_user: myUser,
      myUser: usersFriendships,
      isFriend: isFriend,
    });
  } catch (err) {
    console.log(err);
    return;
  }
};

module.exports.update = async function (req, res) {
  // if (req.user.id == req.params.id) {
  //   User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
  //     req.flash("success", "Updated!");
  //     return res.redirect("back");
  //   });
  // } else {
  //   req.flash("error", "Unauthorized");
  //   return res.status(401).send("Unauthorized");
  // }
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("*****Multer error:", err);
        }

        user.name = req.body.name;
        user.email = req.body.email;
        if (req.file) {
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        req.flash("success", "Profile updated!");
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized");
    return res.status(401).send("Unauthorized");
  }
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "Codial | Sign Up",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }

  return res.render("user_sign_in", {
    title: "Codial | Sign In",
  });
};

module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      req.flash("error", err);
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          req.flash("error", err);
          return;
        }
        return res.redirect("/users/sign-in");
      });
    } else {
      req.flash("success", "You have signed up,Login to continue!");
      return res.redirect("back");
    }
  });
};

module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully!");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.flash("success", "You have Logged out!");
  req.logout();
  return res.redirect("/");
};
