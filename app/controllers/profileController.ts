import { Request, Response } from 'express';

//api:
const userfrontApi = require('../api/userfrontApi');

//Utils:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.findUser = handleAsyncError(async (req: Request, res: Response, next: any) => {
    let username = req.params.id;

    if (username) {
    }
});
