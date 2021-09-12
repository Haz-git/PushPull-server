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
                workoutProgramId: `18118a5a-ffea-4968-b85a-0ffef9015c2d`,
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
