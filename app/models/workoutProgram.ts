'use strict';

import { Model, UUIDV4 } from 'sequelize';

interface workoutProgramAttributes {
    id: string;
    workoutProgramTitle: string;
    workoutProgramDesc: string;
    equipment: string;
    difficulty: string;
    workoutSchedule: string;
    workoutLength: string;
    rating: number;
    reviews: number;
    category: string;
    avgAccurateDifficultyRating: number;
    avgEffectivenessRating: number;
    avgRepeatableRating: number;
    avgFollowLength: number;
    recBegCount: number;
    recIntCount: number;
    recAdvCount: number;
    reviewerBegCount: number;
    reviewerIntCount: number;
    reviewerAdvCount: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class workoutProgram extends Model<workoutProgramAttributes> implements workoutProgramAttributes {
        public id!: string;
        public category!: string;
        public workoutProgramTitle!: string;
        public workoutProgramDesc!: string;
        public equipment!: string;
        public difficulty!: string;
        public workoutSchedule!: string;
        public workoutLength!: string;
        public rating!: number;
        public reviews!: number;
        //New
        public avgAccurateDifficultyRating!: number;
        public avgEffectivenessRating!: number;
        public avgRepeatableRating!: number;
        public avgFollowLength!: number;
        public recBegCount!: number;
        public recIntCount!: number;
        public recAdvCount!: number;
        public reviewerBegCount!: number;
        public reviewerIntCount!: number;
        public reviewerAdvCount!: number;

        static associate(models: any) {
            // define association here
            workoutProgram.belongsTo(models.Category);
        }
    }
    workoutProgram.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            workoutProgramTitle: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            workoutProgramDesc: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            equipment: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            difficulty: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            workoutSchedule: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            workoutLength: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            rating: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            reviews: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            avgAccurateDifficultyRating: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            avgEffectivenessRating: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            avgRepeatableRating: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            avgFollowLength: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            recBegCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            recIntCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            recAdvCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reviewerBegCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reviewerIntCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reviewerAdvCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'workoutProgram',
        },
    );
    return workoutProgram;
};
