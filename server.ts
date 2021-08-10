export {};

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:8081',
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
db.sequelize.sync();

app.get('/', (req: any, res: any) => {
    res.json({ message: 'Hello World!' });
});

const PORT = process.env.PORT || 8080;

//routes

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
