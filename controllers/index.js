const router = require("express").Router();
const userRoutes = require('./routes/userRoutes')
const thoughtRoutes = require('./routes/thoughtRoutes')



router.use('/', userRoutes)
router.use('/', thoughtRoutes)

module.exports = router;

