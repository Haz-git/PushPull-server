'use strict';

import { Model, UUIDV4 } from 'sequelize';

interface templateFileAttributes {
    id: string;
    templateFileTitle: string;
    templateFileDesc: string;
    templateCreatedBy: any; //JSONB
    templateUpdatedAt: Date;
    templateSchedule: any;
    templateWeightUnit: string;
    templateLegend: any;
    templateSavedBlocks: any;
    templateSnapshot: string;
    templateBlocks: any;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class templateFile extends Model<templateFileAttributes> implements templateFileAttributes {
        public id!: string;
        public templateFileTitle!: string;
        public templateFileDesc!: string;
        public templateCreatedBy!: any; //JSONB
        public templateUpdatedAt!: Date;
        public templateSchedule!: any;
        public templateWeightUnit!: string;
        public templateLegend!: any;
        public templateSavedBlocks!: any;
        public templateSnapshot!: string;
        public templateBlocks!: any;
    }

    templateFile.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            templateFileTitle: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            templateFileDesc: {
                type: DataTypes.TEXT,
            },
            templateCreatedBy: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            templateUpdatedAt: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            templateSchedule: {
                type: DataTypes.JSONB,
            },
            templateWeightUnit: {
                type: DataTypes.STRING,
            },
            templateLegend: {
                type: DataTypes.JSONB,
            },
            templateSavedBlocks: {
                type: DataTypes.JSONB,
            },
            templateSnapshot: {
                type: DataTypes.STRING,
            },
            templateBlocks: {
                type: DataTypes.JSONB,
            },
        },
        { sequelize, modelName: 'templateFile' },
    );
    return templateFile;
};