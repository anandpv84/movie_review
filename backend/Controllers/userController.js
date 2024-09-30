const admins = require('../Modals/adminSchema');
const Users = require('../Modals/userSchema')
const Movie = require('../Modals/movieSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');


//===================================================
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
    cloud_name: 'dvgtrq1y5',
    api_key: '753667684381317',
    api_secret: 'wJhCXskGUBWJgpjMSSBUbXMA9fE',
});

const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};


exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json("All fields are required.");
    }

    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json("User already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json("User registered successfully.");
        console.log('User registered successfully')
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error.");
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("Email and password are required.");
    }

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(401).json("Invalid email or password.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json("Invalid email or password.");
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            existingUser: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
        console.log('user login successfull')
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error.");
    }
};

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find().populate('reviews.userId', 'username');
        res.status(200).json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error.");
    }
};

exports.adminlogin = async (req, res) => {
    // console.log("Enter Admin-login function");
    const { username, password } = req.body;
    try {
        const existingAdmin = await admins.findOne({ username });
        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found. Please check your username." });
        }

        if (existingAdmin) {
            if (password === existingAdmin.password) {
                const tokenad = jwt.sign({ adminId: existingAdmin._id }, process.env.JWT_SECRET || 'superkey123', { expiresIn: '1h' });
                // console.log("Admin token:", tokenad);
                console.log("Admin login succesfull")
                return res.status(200).json({
                    admin: {
                        _id: existingAdmin._id,
                        username: existingAdmin.username,
                        email: existingAdmin.email
                    },
                    tokenad: tokenad,
                    message: "Login successful"
                });
            }
            else {
                console.log("Incorrect password.");
                return res.status(401).json({ message: "Invalid password" });
            }
        } else {
            console.log("Admin not found.");
            return res.status(404).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        console.error("Login request failed due to:", err);
        return res.status(500).json({ message: "Login request failed" });
    }
};

exports.addMovie = async (req, res) => {

    console.log("enter add movie controller");
    const { title, year } = req.body;

    let ImageUrl = null;
    if (req.file) {
        try {
            const ImageResult = await uploadFromBuffer(req.file.buffer);
            ImageUrl = ImageResult.secure_url;
        } catch (error) {
            console.error("Error uploading image:", error);
            return res.status(500).json("Error uploading image.");
        }
    }

    const exmovie = await Movie.findOne({ $or: [{ title }] });
    if (exmovie) {
        return res.status(400).json("Movie already exists");
    }

    try {
        const newMovie = new Movie({
            title,
            year,
            Image: ImageUrl,
        });

        await newMovie.save();
        res.status(201).json(newMovie);
        console.log("movie added successfully")
    } catch (err) {
        res.status(501).json("Server error.");
    }
};

exports.deletemovie = async (req, res) => {
    console.log("insise delete controll")
    const { id } = req.params;
    try {
        const remove = await Movie.findByIdAndDelete({ _id: id })
        res.status(200).json("movie deleted successfully")
        console.log("deleted")
    } catch (err) {
        res.status(401).json("delete failed ", err)
        console.log("not deleted")
    }
}


exports.getReviewsByMovieId = async (req, res) => {
    const { movieId } = req.params;
    try {
        const movie = await Movie.findById(movieId).populate('reviews.userId', 'username rating description');
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie.reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error.");
    }
};


exports.addReview = async (req, res) => {
    console.log("entered addreview controller")
    const { movieId, rating, description } = req.body;
    const userId = req.user.userId;
    console.log("rev==", userId)

    if (!rating || !description) {
        return res.status(400).json("All fields are required.");
    }

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json("Movie not found.");
        }

        const newReview = { rating, description, userId };
        movie.reviews.push(newReview);
        await movie.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error.");
    }
};

exports.deleteReview = async (req, res) => {
    console.log("Entered delete review section--===");
    const { reviewId, movieId } = req.params;
    const userId = req.user.userId;
    console.log(userId)

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json("Movie not found.");
        }

        const reviewIndex = movie.reviews.findIndex(review => review._id.toString() === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json("Review not found.");
        }

        const review = movie.reviews[reviewIndex];
        if (review.userId.toString() !== userId.toString()) { // Ensure the user ID field matches your schema
            return res.status(403).json("You are not authorized to delete this review.");
        }

        movie.reviews.splice(reviewIndex, 1);  // Remove the review from the movie's reviews array
        await movie.save();  // Save the updated movie

        res.status(200).json("Review deleted.");
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error.");
    }
};

