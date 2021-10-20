//Express Types
import { Request, Response } from 'express';
const updateWorkoutProgramOnReviewAdd = require('../utils/updateWorkoutProgramOnReviewAdd');

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

exports.addReview = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const { workoutProgramReview } = req.body;

    //We create a review in the review table.
    const addedReview = await db.review.create(workoutProgramReview);

    /*
        We need to update the workout program table based on this new review:

        - Overall Rating
        - Repeatable Rating
        - Accuracy
        - Clear Exercises
        - Reviewer Levels
        - Review Count
        
        Currently, I think the solution is to use an UDPATE + JOIN, and it still hasn't been supported in sequelize. We'll have to use a raw query.
    */

    const totalWorkoutProgramReviews = await db.sequelize.query(
        `SELECT * FROM public.reviews AS reviews WHERE reviews."workoutProgramId" = '${workoutProgramReview.workoutProgramId}'`,
        {
            raw: true,
        },
    );

    const updatedWorkoutProgramDetails = updateWorkoutProgramOnReviewAdd(totalWorkoutProgramReviews);

    return res.status(200).json({
        status: 'Success',
        addedReview: addedReview,
    });
});
