//Express Types
import { Request, Response } from 'express';
const updateWorkoutProgramOnReviewAdd = require('../utils/updateWorkoutProgramOnReviewAdd');

//Model

const db = require('../models');

//Utilities:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.findReviews = handleAsyncError(async (req: Request, res: Response, next: any) => {
    let parentWorkoutProgramId = req.params.id;
    let pageQuery = req.query.page;
    let reviewSort = req.query.sort;

    if (!pageQuery) pageQuery = '0';

    if (parentWorkoutProgramId && pageQuery) {
        let searchedReviews = await db.review.findAndCountAll({
            where: {
                workoutProgramId: parentWorkoutProgramId,
            },
            order: [[`${reviewSort}`, 'DESC']],
            limit: 5,
            offset: parseInt(`${pageQuery}`) * 5,
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

exports.addReview = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { workoutProgramReview } = req.body;

    let workoutProgramObject = { ...workoutProgramReview, reviewAuthorId: userId };

    //We create a review in the review table.
    const addedReview = await db.review.create(workoutProgramObject);

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

exports.updateReviewVotes = handleAsyncError(async (req: Request, res: Response, next: any) => {
    const { reviewRequest } = req.body;

    /*
        example reviewRequest:
        {
            type: string,
            currScore: number,
            reviewId: uuid (number)
        }

    */
    const { type, reviewId } = reviewRequest;

    const currReview = await db.review.findOne({ where: { id: `${reviewId}` } });

    if (type && reviewId && currReview) {
        const {
            dataValues: { notUsefulScore, usefulScore },
        } = currReview;

        switch (type) {
            case 'ADD_USEFUL_SCORE':
                await db.sequelize.query(
                    `UPDATE public.reviews SET "usefulScore" = ${
                        usefulScore + 1
                    } WHERE public.reviews."id" = '${reviewId}'`,
                );
                break;
            case 'REMOVE_USEFUL_SCORE':
                await db.sequelize.query(
                    `UPDATE public.reviews SET "usefulScore" = ${
                        usefulScore - 1
                    } WHERE public.reviews."id" = '${reviewId}'`,
                );
                break;
            case 'ADD_NOT_USEFUL_SCORE':
                await db.sequelize.query(
                    `UPDATE public.reviews SET "notUsefulScore" = ${
                        notUsefulScore + 1
                    } WHERE public.reviews."id" = '${reviewId}'`,
                );
                break;
            case 'REMOVE_NOT_USEFUL_SCORE':
                await db.sequelize.query(
                    `UPDATE public.reviews SET "notUsefulScore" = ${
                        notUsefulScore - 1
                    } WHERE public.reviews."id" = '${reviewId}'`,
                );
                break;
            case 'SWITCH_FROM_NOT_USEFUL_SCORE':
                await db.sequelize.query(
                    `UPDATE public.reviews SET "notUsefulScore" = ${notUsefulScore + 1}, "usefulScore" = ${
                        usefulScore - 1
                    } WHERE public.reviews."id" = '${reviewId}'`,
                );
                break;
            case 'SWITCH_FROM_USEFUL_SCORE':
                await db.sequelize.query(
                    `UPDATE public.reviews SET "notUsefulScore" = ${notUsefulScore - 1}, "usefulScore" = ${
                        usefulScore + 1
                    } WHERE public.reviews."id" = '${reviewId}'`,
                );
                break;
            default:
                throw new Error('Error formatting reviewRequest Object. Please reconfigure and try again.');
        }

        return res.status(200).json({
            status: 'Success',
        });
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'An error occurred updating review votes.',
    });
});

exports.flagReview = handleAsyncError(async (req: Request, res: Response, next: any) => {});
