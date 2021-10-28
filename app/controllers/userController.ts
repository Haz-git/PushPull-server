import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const handleAsyncError = require('../utils/handleAsyncErrors');

//look into userFront API to find request to get user data....

exports.findUser = handleAsyncError(async (req: Request, res: Response, next: any) => {});
