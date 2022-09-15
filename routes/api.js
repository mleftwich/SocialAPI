const Thought = require('../models/thoughts');
const User = require('../models/user');

const router = require('express').Router();

// GET ROUTE FOR USERS
router.get('/users', (req, res) => {
   User.find({})
    .populate("thoughts")
    .populate("friends")
    .then((users) => {
        res.json(users)
    })
});


// POST ROUTE TO CREATE USERS
router.post("/users", (req, res) => {
    const user = new User({
          username: req.body.username,
          email: req.body.email,
          })
          user.save().then(res.json(user))
})

//POST ROUTE TO ADD FRIEND FOR USER
router.post('/users/:userId/friends/:friendId', (req, res) => {
    const userId = req.params.userId
    const friend = req.params.friendId
    User.findById(userId).then(function(user) {
        user.friends.push(friend)
        user.save()
        res.json('friend added:', user)
    })
})

// GET ROUTE FOR THOUGHTS
router.get('/thoughts', (req, res) => {
    Thought.find({})
     .populate("text")
     .populate("username")
     .populate("createdAt")
     .populate("reactions")
     .then((users) => {
         res.json(users)
     })
 });


 // POST ROUTE TO CREATE THOUGHTS
 router.post('/thoughts', (req, res) => {
    const thought = new Thought({
        text: req.body.text,
        username: req.body.username,
        })
        thought.save().then(res.json(thought))
        User.findOne({username: req.body.username}).then(function(user){
            user.thoughts.push(thought._id)
            user.save()
        })
})

module.exports = router;