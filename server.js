const express = require("express");
const Thought = require('./models/thoughts')
require('./config/connection')
routes = require("./routes/api");

// const thought = new Thought({
//   text: "test",
//   username: "itsme",
//   reactions: [
//     {
//     body: "testtest",
//     username: "meagain",
//   }
// ]
//   })


//   thought.save({timestamps: true}).then(console.log(thought));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
