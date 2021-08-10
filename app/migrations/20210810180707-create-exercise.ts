'use strict';
module.exports = {
    up: async (
        queryInterface: {
            createTable: (
                arg0: string,
                arg1: {
                    id: { allowNull: boolean; autoIncrement: boolean; primaryKey: boolean; type: any };
                    title: { type: any };
                    createdAt: { allowNull: boolean; type: any };
                    updatedAt: { allowNull: boolean; type: any };
                },
            ) => any;
        },
        Sequelize: { INTEGER: any; STRING: any; DATE: any },
    ) => {
        await queryInterface.createTable('Exercises', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface: { dropTable: (arg0: string) => any }, Sequelize: any) => {
        await queryInterface.dropTable('Exercises');
    },
};
