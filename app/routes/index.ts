//Express Router Object:
const express = require('express');
const router = express.Router();

//Controllers:
const categoryController = require('../controllers/categoryController');
const workoutProgramController = require('../controllers/workoutProgramController');
const reviewController = require('../controllers/reviewController');

//Category Routes:

router
    .get('/categories/all', categoryController.getAll)
    .get('/categories/:id', categoryController.getOne)
    .post('/categories/create', categoryController.createOne)
    .put('/categories/update/:id', categoryController.updateOne)
    .delete('/categories/delete/:id', categoryController.deleteOne);

//workoutProgram Routes:

router
    .post('/workoutProgram/search/:id', workoutProgramController.findNearby)
    .post('/workoutProgram/all', workoutProgramController.getAll)
    .get('/workoutProgram/:id', workoutProgramController.getOne)
    .post('/workoutProgram/create', workoutProgramController.createOne)
    .put('/workoutProgram/update/:id', workoutProgramController.updateOne)
    .delete('/workoutProgram/delete/:id', workoutProgramController.deleteOne);

//Review Routes:
router.get('/reviews/all/:id', reviewController.findReviews);

module.exports = router;
