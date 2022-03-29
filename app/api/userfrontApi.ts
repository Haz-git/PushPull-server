const axios = require('axios');

let API_KEY;

if (process.env.NODE_ENV !== 'production') {
    API_KEY = process.env.USERFRONT_TEST_API_KEY;
} else {
    API_KEY = process.env.USERFRONT_LIVE_API_KEY;
}

const axiosInstance = axios.create({
    baseURL: 'https://api.userfront.com',
    withCredentials: true,
    headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
});

module.exports = axiosInstance;
