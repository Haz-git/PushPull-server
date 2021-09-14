'use strict';

import { json } from 'sequelize/types';

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
        await queryInterface.bulkInsert('reviews', [
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                id: uuidv4(),
                reviewTitle: 'Terribly complex workout.',
                effectivenessRating: 2.5,
                repeatableRating: 1.4,
                accurateDifficulty: 1.0,
                currentLevel: 'beginner',
                recommendedLevel: 'advanced',
                followLength: 30,
                improvedStats: JSON.stringify({
                    bench: {
                        old: 225,
                        new: 235,
                    },
                    squat: {
                        old: 405,
                        new: 415,
                    },
                    deadlift: {
                        old: 505,
                        new: 515,
                    },
                }),
                reviewDesc: `This workout program is unnecessarily hard and complex! I barely understood the exercises and as you can see--I didn't really improve on anything. Don't try this!`,
                workoutProgramId: `4df77b8d-c564-4a1c-aecb-0b85b12b401c`,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete('reviews', {});
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
