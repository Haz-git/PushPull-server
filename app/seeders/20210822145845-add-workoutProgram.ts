'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('workoutPrograms', [
            {
                id: uuidv4(),
                workoutProgramTitle: `Jim Wendler's 5/3/1`,
                workoutProgramDesc: `Jim Wendler’s 5/3/1 is all about starting with very light weights while progressing slowly and consistently. This extremely popular strength training program is based off of the rep schemes 5, 3, 1, as the name suggests. Throughout the routine you will work with percentages based off of your max, and strive to hit rep PR’s each workout.`,
                equipment: `gym Required`,
                difficulty: `intermediate`,
                workoutSchedule: `3-4 Days/Week`,
                workoutLength: `1-2 Hours`,
                rating: 4.5,
                createdAt: new Date(),
                updatedAt: new Date(),
                CategoryId: `10dc1790-c24d-4421-8aa9-9acd0148be8c`,
            },
            {
                id: uuidv4(),
                workoutProgramTitle: `StrongLifts 5x5`,
                workoutProgramDesc: `StrongLifts 5x5 includes two workouts composed of five different movements. These movements include the squat, deadlift, overhead press, bench press, and barbell row. The rep scheme is consistent, along with the loading scheme per each workout. This workout routine is designed to progress an athlete slow through a simple linear periodized program, aka long-term one direction steady progress. For true beginners, it’s recommended starting very light (even using the bar) and for the barbell novice a starting weight of 50% of your 5-RM is recommended.`,
                equipment: `gym Required`,
                difficulty: `beginner`,
                workoutSchedule: `3-4 Days/Week`,
                workoutLength: `1-2 Hours`,
                rating: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                CategoryId: `10dc1790-c24d-4421-8aa9-9acd0148be8c`,
            },
            {
                id: uuidv4(),
                workoutProgramTitle: `Chinese Olympic Weightlifting Program`,
                workoutProgramDesc: `This program is a 4 week peaking block designed for competition preparation. Originally designed for school-aged lifters.`,
                equipment: `gym Required`,
                difficulty: `intermediate`,
                workoutSchedule: `3-4 Days/Week`,
                workoutLength: `1-2 Hours`,
                rating: 2.5,
                createdAt: new Date(),
                updatedAt: new Date(),
                CategoryId: `5417c5da-7ea6-4fd5-a8ea-6df31fda055b`,
            },
            {
                id: uuidv4(),
                workoutProgramTitle: `Murph CrossFit Program`,
                workoutProgramDesc: `Named after the late Navy Lieutenant Michael Murphy, who was killed in Afghanistan in 2005, it was supposedly his favorite.There are many ways to scale: partitioning, substituting exercises, and adding partners. But just like original Coke, there’s nothing like the real thing.`,
                equipment: `gym Required`,
                difficulty: `advanced`,
                workoutSchedule: `3-4 Days/Week`,
                workoutLength: `1-2 Hours`,
                rating: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
                CategoryId: `a2d1e6b9-cb28-4505-bd96-935b31675f27`,
            },
            {
                id: uuidv4(),
                workoutProgramTitle: `German Volume Training`,
                workoutProgramDesc: `This bodybuilding program is a short-term way to exhaust yourself and gain some muscle mass and strength.`,
                equipment: `gym Required`,
                difficulty: `advanced`,
                workoutSchedule: `3-4 Days/Week`,
                workoutLength: `1-2 Hours`,
                rating: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                CategoryId: `8f0500ee-302b-4f64-b2da-3c1f35100fc9`,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete('workoutPrograms', {
            [Op.or]: [
                { workoutProgramTitle: `Jim Wendler's 5/3/1` },
                { workoutProgramTitle: `StrongLifts 5x5` },
                { workoutProgramTitle: `Chinese Olympic Weightlifting Program` },
                { workoutProgramTitle: `Murph CrossFit Program` },
                { workoutProgramTitle: `German Volume Training` },
            ],
        });
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
