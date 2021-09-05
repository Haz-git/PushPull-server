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
        },
        {
            sequelize,
            modelName: 'workoutProgram',
        },
    );
    return workoutProgram;
};
