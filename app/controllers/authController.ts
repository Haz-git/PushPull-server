import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.authenticateJWT = handleAsyncError(async (req: any, res: Response, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);

    //Verify JWT with Userfront public key
    jwt.verify(token, process.env.USERFRONT_PUBLIC_KEY, (err: any, auth: any) => {
        if (err) return res.sendStatus(403); // Return 403 if there is an error verifying
        req.auth = auth; //auth doesn't exist on Request type from 'express'.
        next();
    });
});
