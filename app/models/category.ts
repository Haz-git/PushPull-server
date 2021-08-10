'use strict';

import { Model, UUIDV4 } from 'sequelize';

//Interfaces:
interface CategoryAttributes {
    id: string;
    categoryTitle: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Category extends Model<CategoryAttributes> implements CategoryAttributes {
        public id!: string;
        public categoryTitle!: string;

        static associate(models: any) {
            // define association here
            Category.hasMany(models.workoutProgram);
        }
    }
    Category.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            categoryTitle: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Category',
        },
    );
    return Category;
};
