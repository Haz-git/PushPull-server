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

    const {
        avgAccuracyRating,
        avgEffectiveRating,
        avgFollowLength,
        avgRepeatableRating,
        totalScoreAvg,
        reviewCount,
        recommendedLevelGroupData,
        reviewerLevelGroupData,
    } = updatedWorkoutProgramDetails;

    //Parsing Group data::

    //Update the parent workoutProgram with new statistics including the new review.

    await db.sequelize.query(
        `UPDATE public."workoutPrograms" SET "reviews" = ${reviewCount}, "avgAccurateDifficultyRating" = ${avgAccuracyRating}, "avgEffectivenessRating" = ${avgEffectiveRating}, "avgRepeatableRating" = ${avgRepeatableRating}, "avgFollowLength" = ${avgFollowLength}, "rating" = ${totalScoreAvg}, "recBegCount" = ${
            recommendedLevelGroupData.Beginner ?? 0
        }, "recIntCount" = ${recommendedLevelGroupData.Intermediate ?? 0}, "recAdvCount" = ${
            recommendedLevelGroupData.Advanced ?? 0
        }, "reviewerBegCount" = ${reviewerLevelGroupData.Beginner ?? 0}, "reviewerIntCount" = ${
            reviewerLevelGroupData.Intermediate ?? 0
        }, "reviewerAdvCount" = ${reviewerLevelGroupData.Advanced ?? 0} WHERE public."workoutPrograms"."id" = '${
            workoutProgramReview.workoutProgramId
        }'`,
        {
            raw: true,
        },
    );

    return res.status(200).json({
        status: 'Success',
        addedReview: addedReview,
    });
});

exports.increaseReviewUsefulScore = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const { reviewRequest } = req.body;

    /*
        example reviewRequest:
        {
            type: string,
            currScore: number,
            reviewId: uuid (number)
        }

    */

    const { type, currScore, reviewId } = reviewRequest;

    if (reviewRequest) {
        switch (type) {
            case 'ADD_USEFUL_SCORE':
                await db.sequelize.query(
                    `UPDATE public.reviews SET "usefulScore" = ${
                        currScore + 1
                    } WHERE public.reviews."id" = '${reviewId}'`,
                );
                break;
            case 'ADD_NOT_USEFUL_SCORE':
                await db.sequelize.query(
                    `UPDATE public.reviews SET "notUsefulScore" = ${
                        currScore + 1
                    } WHERE public.reviews."id" = '${reviewId}'`,
                );
                break;
            default:
                throw new Error('Error formatting reviewRequest Object. Please reconfigure and try again.');
        }
    }
});

exports.flagReview = handleAsyncError(async (req: Request, res: Response, next: any) => {});
