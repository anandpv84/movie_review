const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    Image: { type: String, required: true },
    reviews: [
        {
            rating: { type: Number, required: true },
            description: { type: String, required: true },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        },
    ],
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
