const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

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
