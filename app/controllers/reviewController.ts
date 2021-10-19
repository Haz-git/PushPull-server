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

        // const results = await db.sequelize.query(
        //     `SELECT * FROM public."workoutPrograms" WHERE public."workoutPrograms"."category" = crossfit`,
        //     {
        //         raw: true,
        //     },
        // );

        /* 
            For the life of me I can't figure this out. I'm testing if there's a way to use a raw query to update the workoutProgram associated with the review being added (to update the list of items as described below). However, I'm just trying to input a simple WHERE clause and everything breaks down --> it's saying that the column doesn't exist when it very much does.... figure this out later...
        */

        return res.status(200).json({
            status: 'Success',
            reviews: searchedReviews,
            // test: results,
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

    const results = await sequelize.query('SELECT * FROM public.reviews');

    return res.status(200).json({
        status: 'Success',
        addedReview: addedReview,
    });
});
