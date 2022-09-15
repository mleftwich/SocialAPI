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

router.post("/users", (req, res) => {
    const user = new User({
          username: req.body.username,
          email: req.body.email,
          })
          user.save().then(res.json(user))
})

// GET ROUTE FOR THOUGHTS
router.get('/thoughts', (req, res) => {
    User.find({})
     .populate("text")
     .populate("username")
     .populate("createdAt")
     .populate("reactions")
     .then((users) => {
         res.json(users)
     })
 });

module.exports = router;