"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
require('dotenv').config();
var cors = require('cors');
var app = express();
var corsOptions = {
    origin: 'http://localhost:8081',
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var db = require('./app/models');
db.sync();
app.get('/', function (req, res) {
    res.json({ message: 'Hello World!' });
});
var PORT = process.env.PORT || 8080;
//routes
app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT);
});
