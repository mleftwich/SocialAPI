const User = require("../../models/user");
const Thought = require("../../models/thoughts");
const router = require("express").Router();

// GET ROUTE FOR USERS
router.get("/users", (req, res) => {
  try {
    User.find({})
      .populate("thoughts")
      .populate("friends")
      .then((users) => {
        res.json(users);
      });
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

// GET ROUTE FOR SINGLE USER
router.get("/users/:id", (req, res) => {
  try {
    User.findById(req.params.id)
      .populate("thoughts")
      .populate("friends")
      .then(function (user) {
        if (!user) {
          res.json("User not found");
        } else {
          res.json(user);
        }
      });
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

// PUT ROUTE UPDATE USER BY ID
router.put("/users/update/:id", async (req, res) => {
  try {
  const userId = req.params.id;
  const newName = req.body.username;
  const newEmail = req.body.email;
  const user = await User.findByIdAndUpdate(
    {
      _id: userId,
    },
    { username: newName, email: newEmail }
  );
  if (!user) {
    res.json("User not found");
  } else {
  user.save().then(res.json("Username Updated!"));
  }
  } catch (err) { 
    res.json("There's been an error please check params and try again.");
  }
});

// DELETE USER ROUTE
router.delete("/users/delete/:id", async (req, res) => {
  try {
    const userEnt = await User.findOne({ _id: req.params.id });
    const userName = userEnt.username;
    const thoughts = await Thought.find({ username: userName }).remove();
    const delUser = await User.findOneAndDelete({ _id: req.params.id }).then(
      res.json("User and associated thoughts removed!")
    );
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

// POST ROUTE TO CREATE USERS
router.post("/users", (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
    });
    user.save().then(res.json("User created!"));
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

//POST ROUTE TO ADD FRIEND FOR USER
router.post("/users/:userId/friends/:friendId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const friend = req.params.friendId;
    await User.findById(userId).then(function (user) {
      user.friends.push(friend);
      user.save();
      res.json("Friend Added!");
    });
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

// DELETE ROUTE - FRIEND FROM USER ARRAY
router.delete("/users/:userId/friends/:friendId", (req, res) => {
  try {
    const userId = req.params.userId;
    const friend = req.params.friendId;
    User.findById(userId).then(function (user) {
      if (!user) {
        return res.json("User Not Found");
      } else {
        let arr = user.friends;
        let friendPos = arr.indexOf(friend);
        arr.splice(friendPos, 1);
        user.save().then(res.json("Friend Deleted :("));
      }
    });
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

module.exports = router;
