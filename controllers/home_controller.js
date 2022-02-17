const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  // Post.find({}, function (err, posts) {
  //   return res.render("home", {
  //     title: "Codeial | Home",
  //     posts: posts,
  //   });
  // });

  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

    let users = await User.find({});
    let usersFriendships;

    if (req.user) {
      usersFriendships = await User.findById(req.user._id).populate({
        path: "friendships",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "from_user to_user",
        },
      });
    }

    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
      myUser: usersFriendships,
    });
  } catch (err) {
    console.log("Error", err);
    return;
  }
};
