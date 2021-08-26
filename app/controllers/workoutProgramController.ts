//Express Types:
import { Request, Response } from 'express';

//Model:
const db = require('../models');
const { Op } = require('sequelize');

/* Since we are using the model loader via index.ts (this loader passes all models with sequelize + sequelize.DataTypes)into all of our models, we are importing the database and extracting our specific model via a capitalized key.*/

//Utilities:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.findNearby = handleAsyncError(async (req: Request, res: Response, next: any) => {
    let searchId = req.params.id;
    let pageQuery = req.query.page;

    if (!pageQuery) {
        pageQuery = '0';
    }

    if (pageQuery) {
        const searchedWorkoutPrograms = await db.workoutProgram.findAndCountAll({
            where: {
                [Op.or]: [
                    { workoutProgramTitle: { [Op.iLike]: `%${searchId}%` } },
                    { workoutProgramDesc: { [Op.iLike]: `%${searchId}%` } },
                ],
            },
            order: [['workoutProgramTitle', 'ASC']],
            limit: 8,
            offset: parseInt(`${pageQuery}`) * 8,
        });

        return res.status(200).json({
            status: 'Success',
            workoutPrograms: searchedWorkoutPrograms,
        });
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'Something went wrong. Please refresh and try again.',
    });
});

exports.getAll = handleAsyncError(async (req: Request, res: Response, next: any) => {
    let pageQuery = req.query.page;

    if (!pageQuery) {
        pageQuery = '0';
    }

    const allWorkoutPrograms = await db.workoutProgram.findAndCountAll({
        order: [['workoutProgramTitle', 'ASC']],
        limit: 8,
        offset: parseInt(`${pageQuery}`) * 8,
    });

    return res.status(200).json({
        status: 'Success',
        workoutPrograms: allWorkoutPrograms,
    });
});

exports.getOne = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const specificWorkoutProgram = await db.workoutProgram.findByPk(req.params.id);

    return res.status(200).json({
        status: 'Success',
        workoutPrograms: specificWorkoutProgram,
    });
});

exports.createOne = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const { workoutProgramTitle, categoryId } = req.body;

    const WORKOUTPROGRAM_MODEL = {
        workoutProgramTitle: workoutProgramTitle,
        CategoryId: categoryId,
    };

    const addedWorkoutProgram = await db.workoutProgram.create(WORKOUTPROGRAM_MODEL);
    const allWorkoutPrograms = await db.workoutProgram.findAll();

    return res.status(200).json({
        status: 'Success',
        addedWorkoutProgram: addedWorkoutProgram,
        workoutPrograms: allWorkoutPrograms,
    });
});

exports.updateOne = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const { workoutProgramTitle, categoryId } = req.body;

    const WORKOUTPROGRAM_MODEL = {
        workoutProgramTitle: workoutProgramTitle,
        CategoryId: categoryId,
    };

    const updatedWorkoutProgram = await db.workoutProgram.update(WORKOUTPROGRAM_MODEL, {
        where: { id: req.params.id },
    });
    const allWorkoutPrograms = await db.workoutProgram.findAll();

    return res.status(200).json({
        status: 'Success',
        updatedWorkoutProgram: updatedWorkoutProgram,
        workoutPrograms: allWorkoutPrograms,
    });
});

exports.deleteOne = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const removedWorkoutProgram = await db.workoutProgram.destroy({ where: { id: req.params.id } });
    const allWorkoutPrograms = await db.workoutProgram.findAll();

    return res.status(200).json({
        status: 'Success',
        removedWorkoutProgram: removedWorkoutProgram,
        workoutPrograms: allWorkoutPrograms,
    });
});
