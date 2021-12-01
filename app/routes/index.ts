//Express Router Object:
const express = require('express');
const router = express.Router();

//Controllers:
const AuthController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const workoutProgramController = require('../controllers/workoutProgramController');
const reviewController = require('../controllers/reviewController');
const profileController = require('../controllers/profileController');
const builderController = require('../controllers/builderController');
const projectController = require('../controllers/projectController');

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
    .post('/user/details/update', AuthController.authenticateJWT, profileController.updateUser)
    .post('/user/avatar/update', AuthController.authenticateJWT, profileController.updateUserAvatar)
    .post('/user/review/update', AuthController.authenticateJWT, profileController.updateUserReviewVotes);

//Builder Routes: Separate builder routes, but just expands through profile controller because builder information is stored in data object of user in userfront.
router
    .get('/builder/user', AuthController.authenticateJWT, builderController.findUserBuilderInfo)
    .post('/builder/project/add', AuthController.authenticateJWT, projectController.addProject)
    .put('/builder/project/update/:projectUuid', AuthController.authenticateJWT, builderController.updateProject)
    .delete('/builder/project/delete/:projectId', AuthController.authenticateJWT, builderController.deleteProject);

module.exports = router;
