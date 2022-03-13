'use strict';

import { Model, UUIDV4 } from 'sequelize';

interface templateFileAttributes {
    id: string;
    templateFileTitle: string;
    templateFileDesc: string;
    templateCreatedBy: any; //JSONB
    templateSchedule: any;
    templateWeightUnit: string;
    templateLegend: any;
    templateSnapshot: string;
    templateUserInputs: any;
    templateToolbarBlocks: any;
    templateEditingSurfaceBlocks: any;
    isPublished: boolean;
    isDraft: boolean;
    hasSavedViewTemplate: boolean; //viewTemplates are what others can see.
    savedViewTemplateId: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class templateFile extends Model<templateFileAttributes> implements templateFileAttributes {
        public id!: string;
        public templateFileTitle!: string;
        public templateFileDesc!: string;
        public templateCreatedBy!: any; //JSONB
        public templateSchedule!: any;
        public templateWeightUnit!: string;
        public templateLegend!: any;
        public templateSnapshot!: string;
        public templateUserInputs!: any;
        public templateToolbarBlocks!: any;
        public templateEditingSurfaceBlocks: any;
        public isPublished!: boolean;
        public isDraft!: boolean;
        public hasSavedViewTemplate!: boolean;
        public savedViewTemplateId!: string;
        static associate(models: any) {
            templateFile.belongsTo(models.project);
        }
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
            templateSchedule: {
                type: DataTypes.JSONB,
            },
            templateWeightUnit: {
                type: DataTypes.STRING,
            },
            templateLegend: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
            },
            templateSnapshot: {
                type: DataTypes.STRING,
            },
            templateUserInputs: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
            },
            templateToolbarBlocks: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
                allowNull: false,
            },
            templateEditingSurfaceBlocks: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
                allowNull: false,
            },
            isDraft: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            isPublished: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            hasSavedViewTemplate: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            savedViewTemplateId: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
        },
        { sequelize, modelName: 'templateFile' },
    );
    return templateFile;
};
