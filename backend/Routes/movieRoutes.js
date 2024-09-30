const express = require('express')
const { getAllMovies, addMovie, addReview, deleteReview, adminlogin, deletemovie } = require('../Controllers/userController');
const { protect, protectAdmin } = require('../Middlewares/jwtmiddleware');
// const upload = require('../Middlewares/multerMiddleware')
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', getAllMovies);
router.post('/admin',adminlogin)
router.post('/movieadd',upload.single('Image'),addMovie)
router.delete('/:id',deletemovie)


module.exports = router
