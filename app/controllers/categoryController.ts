//Express Types:
import { Request, Response } from 'express';

//Model:
const categoryModel = require('../models/category');

//Utilities:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.getAll = handleAsyncError(async (req: Request, res: Response, next: any) => {
    return res.status(200).json({
        status: 'Success',
        msg: 'Route established',
    });
});

exports.getOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});

exports.createOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});

exports.updateOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});

exports.deleteOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});
