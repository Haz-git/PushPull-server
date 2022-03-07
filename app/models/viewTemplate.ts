'use strict';

import { Model, UUIDV4 } from 'sequelize';

interface viewTemplateFileAttributes {
    id: string;
    savedTemplate: any; //This is a duplicate of templateFile.
}

module.exports = (sequelize: any, DataTypes: any) => {
    class viewTemplate extends Model<viewTemplateFileAttributes> implements viewTemplateFileAttributes {
        public id!: string;
        public savedTemplate!: any;

        static associate(models: any) {
            viewTemplate.belongsTo(models.templateFile);
        }
    }

    viewTemplate.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            savedTemplate: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
        },
        { sequelize, modelName: 'viewTemplate' },
    );
    return viewTemplate;
};
