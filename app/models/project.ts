'use strict';

import { Model, UUIDV4 } from 'sequelize';

interface projectAttributes {
    id: string;
    createdBy: any; //JSONB
    updatedDate: Date;
    projectMembers: any; //Array
    projectTemplates: any; //Array
    projectName: string;
    projectDesc: string;
    projectColor: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class project extends Model<projectAttributes> implements projectAttributes {
        public id!: string;
        public createdBy!: any; //JSONB
        public updatedDate!: Date;
        public projectMembers!: any; //Array
        public projectTemplates!: any; //Array
        public projectName!: string;
        public projectDesc!: string;
        public projectColor!: string;
    }

    project.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            createdBy: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            updatedDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            projectMembers: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
                allowNull: false,
            },
            projectTemplates: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
            },
            projectName: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            projectDesc: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            projectColor: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { sequelize, modelName: 'project' },
    );

    return project;
};
