import { Request, Response } from 'express';
const { v4: uuid } = require('uuid');

//USERFRONT API:
const userfrontApi = require('../api/userfrontApi');

//Utils:
const handleAsyncError = require('../utils/handleAsyncErrors');

//Model:
const db = require('../models');
const { Op } = require('sequelize');

exports.findUserProjectInfo = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;

    if (userId) {
        let currUser = await userfrontApi.get(`/v0/users/${userId}`);

        if (currUser) {
            let totalProjects = await db.project.findAll({
                where: {
                    projectMembers: {
                        [Op.contains]: [
                            {
                                userfrontUserId: `${userId}`,
                                username: currUser.data.username,
                            },
                        ],
                    },
                },
                order: ['createdAt'],
            });

            return res.status(200).json({
                status: 'Success',
                builder: totalProjects,
            });
        }
        return res.status(401).json({
            status: 'Failure',
            msg: 'Error Accessing User Authentication',
        });
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'Error Accessing User Id',
    });
});

exports.addProject = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { projectDetails } = req.body;

    let projectBody = { ...projectDetails };
    let currUser = await userfrontApi.get(`/v0/users/${userId}`);

    if (currUser && userId) {
        projectBody.id = uuid();
        projectBody.createdBy = {
            userfrontUserId: `${userId}`,
            createdDate: new Date(),
            username: currUser.data.username,
        };
        projectBody.updatedDate = new Date();
        projectBody.projectMembers = [
            {
                username: currUser.data.username,
                userfrontUserId: `${userId}`,
            },
        ];
        projectBody.projectTemplates = [];
        projectBody.userId = `${userId}`;
        projectBody.userImg = currUser.data.data.imageKitAvatarDetails?.thumbnailUrl;

        const addedProject = await db.project.create(projectBody);

        let totalProjects = await db.project.findAll({
            where: {
                projectMembers: {
                    [Op.contains]: [
                        {
                            userfrontUserId: `${userId}`,
                            username: currUser.data.username,
                        },
                    ],
                },
            },
            order: ['createdAt'],
        });

        if (addedProject && totalProjects) {
            return res.status(200).json({
                status: 'Success',
                builder: totalProjects,
            });
        }

        return res.status(500).json({
            status: 'Failed',
            msg: 'Something went wrong updating userfront data object.',
        });
    }

    return res.status(500).json({
        status: 'Failed',
        msg: 'An error occurred retrieving user data object',
    });
});

exports.updateProject = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { projectDetails } = req.body;
    let projectUuid = req.params.projectUuid;

    let newProjectDetails = { ...projectDetails };
    newProjectDetails.updatedDate = new Date();

    if (userId && projectUuid) {
        let currUser = await userfrontApi.get(`/v0/users/${userId}`);
        try {
            let targetProject = await db.project.findOne({
                where: {
                    id: projectUuid,
                },
            });

            await targetProject.update(newProjectDetails);
            await targetProject.save();
            let totalProjects = await db.project.findAll({
                where: {
                    projectMembers: {
                        [Op.contains]: [
                            {
                                userfrontUserId: `${userId}`,
                                username: currUser.data.username,
                            },
                        ],
                    },
                },
                order: ['createdAt'],
            });

            return res.status(200).json({
                status: 'Success',
                builder: totalProjects,
            });
        } catch (err) {
            return res.status(500).json({
                status: 'Failed',
                msg: 'An error occurred retrieving user project',
            });
        }
    }
    return res.status(500).json({
        status: 'Failed',
        msg: 'An error occurred--no credentials provided',
    });
});

exports.deleteProject = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    let projectId = req.params.projectId;

    if (userId && projectId) {
        let currUser = await userfrontApi.get(`/v0/users/${userId}`);

        try {
            //Find target project and destroy:

            let targetProject = await db.project.findOne({
                where: {
                    id: projectId,
                },
            });

            await targetProject.destroy();

            let totalProjects = await db.project.findAll({
                where: {
                    projectMembers: {
                        [Op.contains]: [
                            {
                                userfrontUserId: `${userId}`,
                                username: currUser.data.username,
                            },
                        ],
                    },
                },
                order: ['createdAt'],
            });
            return res.status(200).json({
                status: 'Success',
                builder: totalProjects,
            });
        } catch (err) {
            return res.status(500).json({
                status: 'Failed',
                msg: 'An error occurred deleting user project',
            });
        }
    }
    return res.status(500).json({
        status: 'Failed',
        msg: 'An error occurred--no credentials provided',
    });
});
