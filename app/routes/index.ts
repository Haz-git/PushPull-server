//Express Router Object:
const express = require('express');
const router = express.Router();

//Controllers:
const AuthController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const workoutProgramController = require('../controllers/workoutProgramController');
const reviewController = require('../controllers/reviewController');
const profileController = require('../controllers/profileController');

//Authentication Routes:
router.get('/user/details', AuthController.authenticateJWT);

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
router
    .get('/reviews/all/:id', reviewController.findReviews)
    .post('/reviews/submit/:id', reviewController.addReview)
    .post('/review/update_votes', reviewController.updateReviewVotes);

//Profile Routes:
router
    .get('/user/:username', profileController.findUser)
    .post('/user/update', AuthController.authenticateJWT, profileController.updateUser);

module.exports = router;
