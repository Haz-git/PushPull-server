import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const userfrontApi = require('../api/userfrontApi');
const handleAsyncError = require('../utils/handleAsyncErrors');

//look into userFront API to find request to get user data....

exports.getUser = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;

    try {
        const response = await userfrontApi.get(`/v0/users/${userId}`);
        // console.log(response);

        return res.status(200).json({
            status: 'Success',
            user: response.data,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 'Fail',
            msg: 'An error occurred accessing user data.',
        });
    }
});
