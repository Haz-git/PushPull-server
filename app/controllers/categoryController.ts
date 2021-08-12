//Express Types:
import { Request, Response } from 'express';

//Model:
const db = require('../models');

/* Since we are using the model loader via index.ts (this loader passes all models with sequelize + sequelize.DataTypes)into all of our models, we are importing the database and extracting our specific model via a capitalized key.*/

//Utilities:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.getAll = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const allCategories = await db.Category.findAll();

    return res.status(200).json({
        status: 'Success',
        categories: allCategories,
    });
});

exports.getOne = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const specificCategory = await db.Category.findByPk(req.params.id);

    return res.status(200).json({
        status: 'Success',
        categories: specificCategory,
    });
});

exports.createOne = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const { categoryTitle } = req.body;

    const CATEGORY_MODEL = {
        categoryTitle: categoryTitle,
    };

    const addedCategory = await db.Category.create(CATEGORY_MODEL);
    const allCategories = await db.Category.findAll();

    return res.status(200).json({
        status: 'Success',
        addedCategory: addedCategory,
        categories: allCategories,
    });
});

exports.updateOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});

exports.deleteOne = handleAsyncError(async (req: Request, res: Response, next: any) => {});
