const Thought = require("../models/thoughts");
const User = require("../models/user");

const router = require("express").Router();

// GET ROUTE FOR USERS
router.get("/users", (req, res) => {
  User.find({})
    .populate("thoughts")
    .populate("friends")
    .then((users) => {
      res.json(users);
    });
});

// GET ROUTE FOR SINGLE USER
router.get("/users/:id", (req, res) => {
  User.findById(req.params.id).then(function (user) {
    res.json(user);
  });
});

// PUT ROUTE UPDATE USER BY ID
router.put("/users/update/:id", async (req, res) => {
  const userId = req.params.id;
  const newName = req.body.username;
  const newEmail = req.body.email;
  const user = await User.findByIdAndUpdate(
    {
      _id: userId,
    },
    { username: newName, email: newEmail }
  );
  user.save().then(res.json("Username Updated!"));
});

// DELETE USER ROUTE
router.delete("/users/delete/:id", async (req, res) => {
  const userEnt = await User.findOne({ _id: req.params.id });
  const userName = userEnt.username;
  const thoughts = await Thought.findOneAndDelete({ username: userName });
  const delUser = await User.findOneAndDelete({ _id: req.params.id });
  res.json("User and associated thoughts removed!");
  console.log(userName);
});

// POST ROUTE TO CREATE USERS
router.post("/users", (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
  });
  user.save().then(res.json(user));
});

//POST ROUTE TO ADD FRIEND FOR USER
router.post("/users/:userId/friends/:friendId", (req, res) => {
  const userId = req.params.userId;
  const friend = req.params.friendId;
  User.findById(userId).then(function (user) {
    user.friends.push(friend);
    user.save();
    res.json("Friend Added!");
  });
});

// DELETE ROUTE - FRIEND FROM USER ARRAY
router.delete("/users/:userId/friends/:friendId", (req, res) => {
  const userId = req.params.userId;
  const friend = req.params.friendId;
  User.findById(userId).then(function (user) {
    let arr = user.friends;
    let friendPos = arr.indexOf(friend);
    arr.splice(friendPos, 1);
    user.save();
    res.json("Friend Deleted :(");
  });
});


// GET ROUTE FOR THOUGHTS
router.get("/thoughts", (req, res) => {
  Thought.find({})
    .populate("text")
    .populate("username")
    .populate("createdAt")
    .populate("reactions")
    .then((users) => {
      res.json(users);
    });
});


// GET SINGLE THOUGHT
router.get("/thoughts/:id", (req, res) => {
    Thought.findById(req.params.id).then(function (user) {
      res.json(user);
    });
  });

// POST ROUTE TO CREATE THOUGHTS
router.post("/thoughts", (req, res) => {
  const thought = new Thought({
    text: req.body.text,
    username: req.body.username,
  });
  thought.save().then(res.json(thought));
  User.findOne({ username: req.body.username }).then(function (user) {
    user.thoughts.push(thought._id);
    user.save();
  });
});


// PUT ROUTE TO UPDATE THOUGHT
router.put("/thoughts/update/:id", (req, res) => {
    const thoughtId = req.params.id;
    const newText = req.body.text;
    const thought = User.findByIdAndUpdate(
      {
        _id: thoughtId,
      },
      { text: newText }
    ).then(thought.save())

    res.json("Thought updated!")
    
  });

module.exports = router;
