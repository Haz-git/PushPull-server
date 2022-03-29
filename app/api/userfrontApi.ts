const axios = require('axios');

let API_KEY;

if (process.env.NODE_ENV === 'development') {
    //Why does this not work in dev??

    API_KEY = process.env.USERFRONT_TEST_API_KEY;
}

if (process.env.NODE_ENV === 'production') {
    API_KEY = process.env.USERFRONT_LIVE_API_KEY;
}

console.log(API_KEY);
const axiosInstance = axios.create({
    baseURL: 'https://api.userfront.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${API_KEY}`,
    },
});

module.exports = axiosInstance;
