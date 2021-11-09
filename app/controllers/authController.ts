import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.authenticateJWT = handleAsyncError(async (req: any, res: Response, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);

    let PUBLIC_KEY;

    if (process.env.NODE_ENV !== 'production') {
        PUBLIC_KEY = process.env.USERFRONT_TEST_PUBLIC_KEY?.replace(/\\n/g, '\n');
    } else if (process.env.NODE_ENV === 'production') {
        PUBLIC_KEY = process.env.USERFRONT_LIVE_PUBLIC_KEY?.replace(/\\n/g, '\n');
    }

    //Verify JWT with Userfront public key
    jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err: any, auth: any) => {
        if (err) return res.sendStatus(403); // Return 403 if there is an error verifying

        req.auth = auth; //auth doesn't exist on Request type from 'express'.
        next();
    });
});
