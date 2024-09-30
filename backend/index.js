const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');
const movieRoutes = require('./Routes/movieRoutes');
const ReviewRoutes= require('./Routes/ReviewRoute')
const cors = require('cors');

// dotenv.config();
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.DATABASE)
  .then(() => {
    console.log("MongoDB connected successfully!!!");
  })
  .catch((err) => {
    console.error(`MongoDB connection failed due to: ${err}`);
  });

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews',ReviewRoutes)

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
