//Express Router Object:
const express = require('express');
const router = express.Router();

//Controllers:
const AuthController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const workoutProgramController = require('../controllers/workoutProgramController');
const reviewController = require('../controllers/reviewController');

//Authentication Routes:
router.get('/user/details', AuthController.authenticateJWT);

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
    .post('/workoutProgram/create', workoutProgramController.createsOne)
    .put('/workoutProgram/update/:id', workoutProgramController.updateOne)
    .delete('/workoutProgram/delete/:id', workoutProgramController.deleteOne);

//Review Routes:
router
    .get('/reviews/all/:id', reviewController.findReviews)
    .post('/reviews/submit/:id', reviewController.addReview)
    .post('/reviews/update_votes/:id', reviewController.updateReviewVote);

module.exports = router;
