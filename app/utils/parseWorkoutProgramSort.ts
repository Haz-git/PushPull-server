const parseWorkoutProgramSort = (sortOption: string) => {
    if (sortOption !== undefined && sortOption !== null) {
        switch (sortOption) {
            case 'alphabetical':
                return [['workoutProgramTitle', 'ASC']];
            case 'newest':
                return [['createdAt', 'ASC']];
            case 'topRated':
                return [['rating', 'DESC']];
            case 'mostReviewed':
                return [['reviews', 'DESC']];
            default:
                throw new Error('A sorting error occurred.');
        }
    }
};

module.exports = parseWorkoutProgramSort;
