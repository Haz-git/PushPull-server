const updateWorkoutProgramOnReviewAdd = (reviewQueryArray: any[]) => {
    //Function should extract all values from all reviews pertaining to a workout program, average them, and then return them all into an object for updating.

    //Summing and averaging all rating values:

    let totalReviews = reviewQueryArray[0];
    const reviewCount = totalReviews.length;

    const sumAccuracyRating = totalReviews.map((review) => review.accurateDifficulty).reduce((a, b) => a + b, 0);

    const sumRepeatableRating = totalReviews.map((review) => review.repeatableRating).reduce((a, b) => a + b, 0);

    const sumEffectiveRating = totalReviews.map((review) => review.effectivenessRating).reduce((a, b) => a + b, 0);

    const sumFollowLength = totalReviews.map((review) => review.followLength).reduce((a, b) => a + b, 0);

    const avgFollowLength = Math.round((sumFollowLength / reviewCount) * 10) / 10;

    const avgAccuracyRating = Math.round((sumAccuracyRating / reviewCount) * 10) / 10;
    const avgRepeatableRating = Math.round((sumRepeatableRating / reviewCount) * 10) / 10;
    const avgEffectiveRating = Math.round((sumEffectiveRating / reviewCount) * 10) / 10;

    const totalScoreAvg =
        Math.round(((avgAccuracyRating + avgRepeatableRating + avgEffectiveRating) / reviewCount) * 10) / 10;

    //Summing all recommendedLevels and reviewerLevels:

    const recommendedLevelGroupData = totalReviews.reduce((groups, singleReview) => {
        const { Beginner = 0, Intermediate = 0, Advanced = 0 } = groups;
        if (singleReview.recommendedLevel === 'beginner') {
            return { ...groups, Beginner: Beginner + 1 };
        } else if (singleReview.recommendedLevel === 'intermediate') {
            return { ...groups, Intermediate: Intermediate + 1 };
        } else if (singleReview.recommendedLevel === 'advanced') {
            return { ...groups, Advanced: Advanced + 1 };
        }
    }, {});

    const reviewerLevelGroupData = totalReviews.reduce((groups, singleReview) => {
        const { Beginner = 0, Intermediate = 0, Advanced = 0 } = groups;
        if (singleReview.currentLevel === 'beginner') {
            return { ...groups, Beginner: Beginner + 1 };
        } else if (singleReview.currentLevel === 'intermediate') {
            return { ...groups, Intermediate: Intermediate + 1 };
        } else if (singleReview.currentLevel === 'advanced') {
            return { ...groups, Advanced: Advanced + 1 };
        }
    }, {});

    return {
        avgAccuracyRating,
        avgRepeatableRating,
        avgEffectiveRating,
        avgFollowLength,
        totalScoreAvg,
        reviewCount,
        recommendedLevelGroupData,
        reviewerLevelGroupData,
    };
};

module.exports = updateWorkoutProgramOnReviewAdd;
