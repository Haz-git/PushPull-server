import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const handleAsyncError = require('../utils/handleAsyncErrors');

// const publicKey = `-----BEGIN PUBLIC KEY-----
// MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmnODEMVNuvlWsuJB98sZ
// 1H5ELcRr7+ZT/bz7BhmFC6cj79JB13X3qQUNFth5InrVUrcNlV3q+Kfjx4Ou8yr7
// sdl1I6HsJIWU5V8uh65NO/S5qoDBQBDo6mhnoYl+c/v472FnEChP9phuF/E6jKr+
// /lETdrw+glh+1uRCCBQ1XdtagJgiiI/qu9n18y3xzX7U0MRVf75/ccMl1ojmwZqu
// N6AuCv1zg1XlYh061hLpjg3yH5IqAg5YrE58pnLIcQ+IXxpcwawdOVxAgYtKxyK9
// yxFIlsLOJUYkscS/RFLY/84w9E1v4EKTBiW+pYKzBF1IqPeqmsgOy0mYioaDcm5b
// 92YKcWKuDpO7lAbwH80pKFhGRhsQRrAS77WZoxAvaMhrPz6zXefGzDqPhYiluxzM
// s5pzOnyXuQBJUeAkXbkQSR4K67q3jc5/OaMF6V9dSKYcwJquDKc93o+21BpGtV9q
// R49vEN8HU9jARCJvImn2efUJa8p5flu2a2urATg1TCFwm4nhhIwMAHW1ppVnaUlW
// L9RESrkMbbGWLvj+70ylSgvXBe7YKZ7CUC33PueU2a47MD90OenxLWv0iaaV/3Fs
// A8jodSUQS4tJyrwsdybpkDNVACuA7UDtvS6wALVqG/GSZNgDwc1gRsrb2LyhmlnP
// HIX5s7/dN90yGndq/AVKA60CAwEAAQ==
// -----END PUBLIC KEY-----`;

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
