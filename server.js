const express = require("express");
require('./config/connection')
routes = require("./controllers/index");


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
