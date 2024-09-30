import axios from 'axios';

export const commonApi = async (httpRequest, url, reqBody, reqHeader) => {
    const reqConfig = {
        method: httpRequest,
        url: url,
        data: reqBody,
        headers: reqHeader || { "Content-Type": "application/json" }
    };

    try {
        const result = await axios(reqConfig);
        return result;
    } catch (error) {
        // You can throw the error or return a standardized error object
        throw new Error(error.response?.data || error.message);
    }
};
