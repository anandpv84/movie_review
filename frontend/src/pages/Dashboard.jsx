import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row, Button, Form, Card } from 'react-bootstrap';
import { allmovieApi, deleteReviewApi } from '../services/allApi';
import { BASE_URL } from '../services/baseUrl';
import axios from 'axios';
import '../pages/dash.css';

function Dashboard() {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [allMovies, setAllMovies] = useState([]);
    const [username, setUsername] = useState('');
    const [clicked, setClicked] = useState({});
    const [movieReviews, setMovieReviews] = useState({});
    const [reviewInputs, setReviewInputs] = useState({}); // Review state
    const [stars, setStars] = useState({}); // Star rating state
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const existingUserData = sessionStorage.getItem("existinguser");
        if (existingUserData) {
            const user = JSON.parse(existingUserData);
            setUsername(user.username);
            setUserId(user._id);
        }
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.log("No token found, redirecting to login.");
            navigate('/login');
        } else {
            setToken(token);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const moviesResult = await allmovieApi();
                setAllMovies(moviesResult.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies();
    }, [token]);

    const fetchReviews = async (movieId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/reviews/movie/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMovieReviews((prev) => ({
                ...prev,
                [movieId]: response.data
            }));
        } catch (error) {
            console.error("Error fetching reviews:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        allMovies.forEach(movie => {
            if (movie._id) {
                fetchReviews(movie._id);
            } else {
                console.error("Movie ID is undefined:", movie);
            }
        });
    }, [allMovies]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("existinguser");
        navigate('/');
    };

    const onClick = (rating, movieId) => {
        setClicked((prev) => ({ ...prev, [movieId]: true }));
        setStars((prev) => ({ ...prev, [movieId]: rating }));
    };

    const resetForm = (movieId) => {
        setStars((prev) => ({ ...prev, [movieId]: 0 }));
        setReviewInputs((prev) => ({ ...prev, [movieId]: '' }));
        setClicked((prev) => ({ ...prev, [movieId]: false }));
    };

    const submitReview = async (e, movieId) => {
        e.preventDefault();
        const review = reviewInputs[movieId];
        const rating = stars[movieId] || 1;

        if (!review || rating === 0) {
            console.error("Please provide a valid review and rating");
            return;
        }

        const newReview = { movieId, rating, description: review };
        try {
            await axios.post(`${BASE_URL}/api/reviews/addreview`, newReview, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMovieReviews((prev) => ({
                ...prev,
                [movieId]: [...(prev[movieId] || []), newReview]
            }));
            resetForm(movieId);
        } catch (error) {
            console.error("Error submitting review:", error.response?.data || error.message);
        }
    };

    const deleteReview = async (e, reviewId, movieId) => {
        e.preventDefault();

        try {
            await deleteReviewApi(reviewId, movieId, token);
            setMovieReviews((prev) => ({
                ...prev,
                [movieId]: prev[movieId].filter(review => review._id !== reviewId)
            }));
        } catch (error) {
            console.error("Error deleting review:", error.response?.data || error.message);
        }
    };

    const StarRating = ({ rating, movieId, interactive = true }) => (
        <div>
            {[...Array(5)].map((_, i) => (
                <i
                    key={i}
                    className={`me-2 ${rating > i ? 'fas' : 'far'} fa-star`}
                    onClick={() => interactive && onClick(i + 1, movieId)}
                    style={{ cursor: interactive ? "pointer" : "default", fontSize: ".8rem" }}
                />
            ))}
        </div>
    );

    return (
        <div className='p-5 pt-1 bgc'>
            <div className='m-2 d-flex justify-content-between'>
                <Link to={'/adminlogin'} style={{ textDecoration: "none", color: "black" }}>
                    <h4>LATEST MOVIES</h4>
                </Link>
                <button onClick={handleLogout} className='log'>
                    <span>LOGOUT</span>
                    <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0" />
                    </svg>
                </button>
            </div>
            <div className="row">
                {
                    allMovies.length > 0 ? allMovies.slice().reverse().map((item) => (
                        <div className="col mb-4" key={item._id}>
                            <div className="card" style={{ width: "16rem" }}>
                                <img height={'150px'} src={item.Image} className="card-img-top" alt={item.title} />
                                <div className="card-body1">
                                    <p className="card-text">{item.title} <span className='ms-1'>({item.year})</span></p>
                                </div>
                                <Container className="justify-content-start align-items-start d-flex">
                                    <Col>
                                        <Row>
                                            <Col className=''>
                                                <StarRating
                                                    rating={stars[item._id] || 0} // Use specific rating for the movie
                                                    movieId={item._id}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='mb-2'>
                                                <Form.Group>
                                                    <Form.Control
                                                        className="custom-placeholder"
                                                        placeholder='What do you think about this film?'
                                                        as="textarea"
                                                        rows={3}
                                                        value={reviewInputs[item._id] || ''} // Use specific review for the movie
                                                        onChange={e => setReviewInputs(prev => ({ ...prev, [item._id]: e.target.value }))} // Update specific review
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='mb-2'>
                                                <Button className='typ' onClick={() => resetForm(item._id)} variant='warning'>Reset</Button>{" "}
                                                <Button className='typ' onClick={(e) => submitReview(e, item._id)} disabled={!reviewInputs[item._id]} variant='success'>Submit</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Container>
                                <div className="card-body overflow-auto p-0 custom-scrollbar">
                                    <div className="comment-section">
                                        <Row>
                                            <Col className='mb-2'>
                                                {(movieReviews[item._id] || []).slice().reverse().map((r, rindex) => (
                                                    <Card className='mb-2' key={rindex}>
                                                        <Card.Body className='p-2'>
                                                            <div className="rating-container d-flex" style={{ fontSize: "14px" }}>
                                                                <span>{r.userId?.username} : </span>
                                                                <StarRating rating={r.rating} interactive={false} movieId={item._id} />
                                                            </div>
                                                            <p className='mt-1 m-0'>{r.description}</p>
                                                            <div className='d-flex justify-content-end'>
                                                                {r.userId?._id === userId && (
                                                                    <Button className='boton' onClick={(e) => deleteReview(e, r._id, item._id)}>Delete</Button>
                                                                )}
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                ))}
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <h1>No movies found</h1>
                }
            </div>
        </div>
    );
}

export default Dashboard;
