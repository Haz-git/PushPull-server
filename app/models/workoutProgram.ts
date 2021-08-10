'use strict';

import { Model, UUIDV4 } from 'sequelize';

interface workoutProgramAttributes {
    id: string;
    workoutProgramTitle: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class workoutProgram extends Model<workoutProgramAttributes> implements workoutProgramAttributes {
        public id!: string;
        public workoutProgramTitle!: string;

        static associate(models: any) {
            // define association here
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
            workoutProgramTitle: {
                type: DataTypes.STRING,
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
