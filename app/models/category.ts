// import { DataTypes, Model, Optional } from 'sequelize/types';
// import { sequelize } from '.';

// interface CategoryAttributes {
//     id: string;
//     categoryName: string;
// }

// interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

// interface CategoryInstance extends Model<CategoryAttributes, CategoryCreationAttributes>, CategoryAttributes {
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// const Category = sequelize.define<CategoryInstance>('Category', {
//     id: {
//         allowNull: false,
//         autoIncrement: false,
//         primaryKey: true,
//         type: DataTypes.UUID,
//         unique: true,
//     },
//     categoryName: {
//         allowNull: false,
//         type: DataTypes.TEXT,
//     },
// });

// export default Category;
