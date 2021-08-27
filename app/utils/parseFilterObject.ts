const parseFilterObject = (filterObject: any) => {
    if (filterObject !== undefined && filterObject !== null) {
        for (const key in filterObject) {
            switch (key) {
                case 'category':
                    if (filterObject[key] === 'any') {
                        filterObject[key] = ['powerlifting', 'crossfit', 'bodybuilding', 'weightlifting'];
                    } else {
                        filterObject[key] = [filterObject[key]];
                    }
                    break;
                case 'difficulty':
                    if (filterObject[key] === 'any') {
                        filterObject[key] = ['any', 'advanced', 'intermediate', 'beginner'];
                    } else {
                        filterObject[key] = [filterObject[key]];
                    }
                    break;
                case 'equipment':
                    if (filterObject[key] === 'any') {
                        filterObject[key] = ['any', 'gym Required', 'no Equipment', 'outdoors'];
                    } else {
                        filterObject[key] = [filterObject[key]];
                    }
                    break;
                case 'workoutLength':
                    if (filterObject[key] === 'any') {
                        filterObject[key] = ['any', '< 45 Minutes', '1-2 Hours', '2-3 Hours', '3+ Hours'];
                    } else {
                        filterObject[key] = [filterObject[key]];
                    }
                    break;
                case 'workoutSchedule':
                    if (filterObject[key] === 'any') {
                        filterObject[key] = ['any', '1-2 Days/Week', '3-4 Days/Week', '5-7 Days/Week'];
                    } else {
                        filterObject[key] = [filterObject[key]];
                    }
                    break;
                default:
                    throw new Error('Something went wrong processing your filter.');
            }
        }
    }

    return filterObject;
};

module.exports = parseFilterObject;
