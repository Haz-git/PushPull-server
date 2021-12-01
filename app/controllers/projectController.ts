import { Request, Response } from 'express';
const { v4: uuid } = require('uuid');

//USERFRONT API:
const userfrontApi = require('../api/userfrontApi');

//Utils:
const handleAsyncError = require('../utils/handleAsyncErrors');

//Model:
const db = require('../models');
const { Op } = require('sequelize');

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
            userImage: currUser.data.image,
        };
        projectBody.updatedDate = new Date();
        projectBody.projectMembers = [
            {
                username: currUser.data.username,
                userImage: currUser.data.image,
                userfrontUserId: `${userId}`,
                mode: 'EDIT',
            },
        ];
        projectBody.projectTemplates = [];

        const addedProject = await db.project.create(projectBody);

        let totalProjects = await db.project.findAll({
            where: {
                projectMembers: {
                    [Op.contains]: [
                        {
                            userfrontUserId: `${userId}`,
                            username: currUser.data.username,
                            userImage: currUser.data.image,
                            mode: 'EDIT',
                        },
                    ],
                },
            },
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
