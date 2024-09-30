import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";

export const registerApi = async (user) => {
    try {
        return await commonApi('post', `${BASE_URL}/api/auth/register`, user);
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const loginApi = async (reqBody) => {
    try {
        return await commonApi('post', `${BASE_URL}/api/auth/login`, reqBody);
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};


export const allmovieApi = async () => {
    return await commonApi("get", `${BASE_URL}/api/movies`, '', '')
}

export const adminloginApi = async (reBody) => {
    return await commonApi('post', `${BASE_URL}/api/movies/admin`, reBody, "")
}

export const addmovieApi = async (reBody, token) => {
    return await commonApi('post', `${BASE_URL}/api/movies/movieadd`, reBody,
        {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        })
}

export const deleteApi = async (id) => {
    return await commonApi("DELETE", `${BASE_URL}/api/movies/${id}`, {},
        {
            "Content-Type": "multipart/form-data"
        })
}

export const fetchReviewsApi = async (movieId, token) => {
    return await commonApi("get", `${BASE_URL}/api/reviews/movie/${movieId}`, '', {
        Authorization: `Bearer ${token}`
    });
};

export const deleteReviewApi = async (reviewId, movieId, token) => {
    return await commonApi("DELETE", `${BASE_URL}/api/reviews/${movieId}/reviews/${reviewId}`, {}, {
        Authorization: `Bearer ${token}`
    });
};
