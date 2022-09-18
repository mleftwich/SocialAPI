const React = require("../models/thoughts");
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
    console.log(user.friendCount)
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
});

// POST ROUTE TO CREATE USERS
router.post("/users", (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
  });
  user.save().then(res.json('User created!'));
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
    .then((thoughts) => {
      res.json(thoughts);
    });
});


// GET SINGLE THOUGHT
router.get("/thoughts/:id", (req, res) => {
    Thought.findById(req.params.id).then(function (thought) {
      res.json(thought);
    });
  });

// POST ROUTE TO CREATE THOUGHTS
router.post("/thoughts", (req, res) => {
  const thought = new Thought({
    text: req.body.text,
    username: req.body.username,
  });
  thought.save().then(res.json('Thought created!'));
  User.findOne({ username: req.body.username }).then(function (user) {
    user.thoughts.push(thought._id);
    user.save();
  });
});


// PUT ROUTE TO UPDATE THOUGHT
router.put("/thoughts/update/:id", async (req, res) => {
  const thoughtId = req.params.id;
  const newText = req.body.text;
  const thought = await Thought.findByIdAndUpdate(
    {
      _id: thoughtId,
    },
    { text: newText }
  );
  thought.save().then(res.json("Thought Updated!"));
});

// ROUTE TO DELETE THOUGHT
router.delete("/thoughts/delete/:id", (req, res) => {
  const thought = Thought.findOneAndDelete({ '_id': req.params.id}).then(function(thought) {
    res.json("Thought deleted!")
  })
})


// POST ROUTE FOR REACTIONS
router.post("/thoughts/:id/reactions", async (req, res) => {
  const reaction = req.body.text
  const user = req.body.username
  Thought.findOne({ _id: req.params.id }).then(function (thought) {
    thought.reactions.push({ "body": reaction, "username": user });
    thought.save();
    res.json("Reaction added!")
  });
});

// !! TODO DELETE REACTION !!
router.delete("/thoughts/:thoughtId/reactions/:reactId", async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const reactId = req.params.reactId
  Thought.findById(thoughtId).then(function (thought) {
    let arr = thought.reactions;
    let reactPos = arr.indexOf(reactId);
    arr.splice(reactPos, 1);
    thought.save();
    res.json("Reaction deleted!");
  });

})
module.exports = router;
