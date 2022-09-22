const Thought = require("../../models/thoughts");
const moment = require("moment");
const router = require("express").Router();

// GET ROUTE FOR THOUGHTS
router.get("/thoughts", (req, res) => {
  Thought.find({})
    .populate("text")
    .populate("username")
    .populate("reactions")
    .then((thoughts) => {
      res.json(thoughts);
    });
});

// GET SINGLE THOUGHT
router.get("/thoughts/:id", (req, res) => {
  try {
    Thought.findById(req.params.id).then(function (thought) {
      if (!thought) {
        res.json("Thought not found");
      } else {
        res.json(thought);
      }
    });
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

// POST ROUTE TO CREATE THOUGHTS
router.post("/thoughts", (req, res) => {
  try {
    const thought = new Thought({
      text: req.body.text,
      username: req.body.username,
    });
    thought.save().then(res.json("Thought created!"));
    User.findOne({ username: req.body.username }).then(function (user) {
      user.thoughts.push(thought._id);
      user.save();
    });
  } catch (err) {
    res.json("There's been an error please try again.");
  }
});

// PUT ROUTE TO UPDATE THOUGHT
router.put("/thoughts/update/:id", async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const newText = req.body.text;
    const thought = await Thought.findByIdAndUpdate(
      {
        _id: thoughtId,
      },
      { text: newText }
    );
    thought.save().then(res.json("Thought Updated!"));
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

// ROUTE TO DELETE THOUGHT
router.delete("/thoughts/delete/:id", (req, res) => {
  try {
    const thought = Thought.findOneAndDelete({ _id: req.params.id }).then(
      function (thought) {
        if (!thought) {
          res.json("No thought to delete");
        } else {
          res.json("Thought deleted!");
        }
      }
    );
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

// POST ROUTE FOR REACTIONS
router.post("/thoughts/:id/reactions", async (req, res) => {
  try {
    const reaction = req.body.text;
    const user = req.body.username;
    Thought.findOne({ _id: req.params.id }).then(function (thought) {
      if (!thought) {
        res.json("Can't react to something that doesn't exist");
      } else {
        thought.reactions.push({ body: reaction, username: user });
        thought.save();
        res.json("Reaction added!");
      }
    });
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

// !! TODO DELETE REACTION !!
router.delete("/thoughts/:thoughtId/reactions/:reactId", async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const reactId = req.params.reactId;
    Thought.findById(thoughtId).then(function (thought) {
      if (!thought) {
        return res.json("No original thought");
      }
      let arr = thought.reactions;
      let reactPos = arr.indexOf(reactId);
      arr.splice(reactPos, 1);
      thought.save().then(res.json("Reaction deleted!"));
    });
  } catch (err) {
    res.json("There's been an error please check params and try again.");
  }
});

module.exports = router;
