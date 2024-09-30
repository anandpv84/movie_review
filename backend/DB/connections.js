// require('dotenv').config();

// const mongoose = require('mongoose');

// const connectionString = process.env.DATABASE;

// mongoose.connect(connectionString).then(() => {
//   console.log("MongoDB connected successfully!!!");
// }).catch((err) => {
//   console.error(`MongoDB connection failed due to: ${err}`);
// });


require('dotenv').config();
const mongoose = require('mongoose');

const connectionString = process.env.DATABASE;

mongoose.connect(connectionString)
  .then(() => {
    console.log("MongoDB connected successfully!!!");
  })
  .catch((err) => {
    console.error(`MongoDB connection failed due to: ${err}`);
  });
