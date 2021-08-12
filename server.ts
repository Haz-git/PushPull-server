export {};

//Express:
const express = require('express');
//Router:
const router = require('./app/routes/index');
require('dotenv').config();

//Security Dependencies:
const cors = require('cors');
const helmet = require('helmet');
const exRateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');

//Initiating Express App:
const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss());
app.use(hpp());

const rateLimiter = exRateLimit({
    max: 1000,
    windowMs: 60 * 60 * 100,
    message: 'Too many requests from this IP. Please try again later.',
});

// app.use('/api', rateLimiter);

const corsOptions = {
    origin: 'http://localhost:8081',
};

const db = require('./app/models');
db.sequelize.sync();

app.get('/', (req: any, res: any) => {
    res.json({ message: 'Hello World!' });
});

const PORT = process.env.PORT || 8080;

//routes via router:
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
