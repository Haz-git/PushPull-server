//Express Types
import { Request, Response } from 'express';

//Model

const db = require('../models');
const { Op } = require('sequelize');

//Utilities:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.findReviews = handleAsyncError(async (req: Request, res: Response, next: any) => {
    let parentWorkoutProgramId = req.params.id;
    let pageQuery = req.query.page;

    if (!pageQuery) pageQuery = '0';

    if (parentWorkoutProgramId && pageQuery) {
        let searchedReviews = await db.review.findAndCountAll({
            where: {
                workoutProgramId: parentWorkoutProgramId,
            },
            order: [['reviewTitle', 'DESC']],
            limit: 8,
            offset: parseInt(`${pageQuery}`) * 8,
        });

        return res.status(200).json({
            status: 'Success',
            reviews: searchedReviews,
        });
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'Something went wrong loading reviews. Please refresh and try again',
    });
});
