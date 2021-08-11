//Express Types:
import { Request, Response } from 'express';

//Model:
const db = require('../models');

//Utilities:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.getAll = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const allCategories = await db.Category.findAll();

    return res.status(200).json({
        status: 'Success',
        categories: allCategories,
    });
});

exports.getOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});

exports.createOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});

exports.updateOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});

exports.deleteOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});
