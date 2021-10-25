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

//AppError:
import AppError from './app/utils/appError';

//Initiating Express App:
const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss());
app.use(hpp());

const rateLimiter = exRateLimit({
    max: 5000,
    windowMs: 60 * 60 * 100,
    message: 'Too many requests from this IP. Please try again later.',
});

app.use('/api/', rateLimiter);

// app.use('/api', rateLimiter);

const allowedDomains = ['https://gopushpull.com', 'https://pushpull.netlify.app', 'http://localhost:3000'];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedDomains.indexOf(origin) === -1) {
                const msg = `This site ${origin} does not have access to this server. Only specific domains are allowed.`;

                return callback(new Error(msg), false);
            }

            return callback(null, true);
        },
        credentials: true,
    }),
);

const db = require('./app/models');
db.sequelize.sync();

app.get('/', (req: any, res: any) => {
    res.json({ message: 'Hello World!' });
});

const PORT = process.env.PORT || 8080;

//routes via router:
app.use('/api', router);

//Error interface:
interface ErrorWithStatus extends Error {
    status: string;
    statusCode: number;
}

//Global middleware handler for all routes non-defined:
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
