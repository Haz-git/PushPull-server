'use strict';

import { Model, UUIDV4 } from 'sequelize';

interface reviewAttributes {
    id: string;
    reviewTitle: string;
    effectivenessRating: number;
    repeatableRating: number;
    accurateDifficulty: number;
    currentLevel: string;
    recommendedLevel: string;
    followLength: number;
    improvedStats: any; //jsonb datatype
    reviewDesc: string;
    reviewAuthorId: string;
    usefulScore: number;
    notUsefulScore: number;
    flaggedCount: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class review extends Model<reviewAttributes> implements reviewAttributes {
        public id!: string;
        public reviewTitle!: string;
        public effectivenessRating!: number;
        public repeatableRating!: number;
        public accurateDifficulty!: number;
        public currentLevel!: string;
        public recommendedLevel!: string;
        public followLength!: number;
        public improvedStats!: any;
        public reviewDesc!: string;
        public reviewAuthorId!: string;
        public usefulScore!: number;
        public notUsefulScore!: number;
        public flaggedCount!: number;

        static associate(models: any) {
            // define association here
            review.belongsTo(models.workoutProgram);
        }
    }
    review.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            reviewTitle: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            effectivenessRating: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            repeatableRating: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            accurateDifficulty: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            currentLevel: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            recommendedLevel: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            followLength: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            improvedStats: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            reviewDesc: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            reviewAuthorId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            usefulScore: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            notUsefulScore: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            flaggedCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'review',
        },
    );
    return review;
};
