//Express Router Object:
const express = require('express');
const router = express.Router();

//Controllers:
const AuthController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const workoutProgramController = require('../controllers/workoutProgramController');
const reviewController = require('../controllers/reviewController');
const profileController = require('../controllers/profileController');
const projectController = require('../controllers/projectController');
const templateController = require('../controllers/templateController');

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
    .post('/reviews/submit/:id', AuthController.authenticateJWT, reviewController.addReview)
    .post('/review/update_votes', reviewController.updateReviewVotes);

//Profile Routes:
router
    .get('/user/:username', profileController.findUser)
    .post('/user/details/update', AuthController.authenticateJWT, profileController.updateUser)
    .post('/user/avatar/update', AuthController.authenticateJWT, profileController.updateUserAvatar)
    .post('/user/review/update', AuthController.authenticateJWT, profileController.updateUserReviewVotes);

//Builder Routes:
router
    .get('/builder/user', AuthController.authenticateJWT, projectController.findUserProjectInfo)
    .post('/builder/project/add', AuthController.authenticateJWT, projectController.addProject)
    .put('/builder/project/update/:projectUuid', AuthController.authenticateJWT, projectController.updateProject)
    .delete('/builder/project/delete/:projectId', AuthController.authenticateJWT, projectController.deleteProject);

//Template Routes:
router
    .get('/template/project/:projectUuid', AuthController.authenticateJWT, templateController.findTemplates)
    .get('/template/query/:templateId', AuthController.authenticateJWT, templateController.queryTemplate)
    .post('/template/add', AuthController.authenticateJWT, templateController.addTemplate)
    .post('/template/toolbar/add/:templateId', AuthController.authenticateJWT, templateController.addToolbarBlocks)
    .post(
        '/template/surface/rename-column/:templateId',
        AuthController.authenticateJWT,
        templateController.renameEditingSurfaceColumns,
    )
    .post(
        '/template/surface/add/:templateId',
        AuthController.authenticateJWT,
        templateController.addEditingSurfaceBlocks,
    )
    .post(
        '/template/surface/reorder-column/:templateId',
        AuthController.authenticateJWT,
        templateController.reorderEditingSurfaceColumns,
    )
    .put('/template/update/:templateId', AuthController.authenticateJWT, templateController.updateTemplate)
    .delete('/template/delete/:templateId', AuthController.authenticateJWT, templateController.deleteTemplate)
    .delete(
        '/template/toolbar/delete/:templateId',
        AuthController.authenticateJWT,
        templateController.deleteToolbarBlocks,
    )
    .delete(
        '/template/surface/delete/:templateId',
        AuthController.authenticateJWT,
        templateController.deleteEditingSurfaceBlocks,
    );

module.exports = router;
