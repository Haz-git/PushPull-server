"use strict";
var _a = process.env, DATABASE_HOST = _a.DATABASE_HOST, DATABASE_USER = _a.DATABASE_USER, DATABASE_PASSWORD = _a.DATABASE_PASSWORD, DATABASE_NAME = _a.DATABASE_NAME;
module.exports = {
    HOST: DATABASE_HOST,
    USER: DATABASE_USER,
    PASSWORD: DATABASE_PASSWORD,
    DB: DATABASE_NAME,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
