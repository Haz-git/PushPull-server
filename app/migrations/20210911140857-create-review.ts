'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('reviews', {
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            reviewTitle: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            effectivenessRating: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            repeatableRating: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            accurateDifficulty: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            currentLevel: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            recommendedLevel: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            followLength: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            improvedStats: {
                type: Sequelize.JSONB,
                allowNull: false,
            },
            reviewDesc: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('reviews');
    },
};
