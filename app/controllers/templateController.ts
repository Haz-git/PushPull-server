import { Request, Response } from 'express';
const { v4: uuid } = require('uuid');

//USERFRONT API:
const userfrontApi = require('../api/userfrontApi');

//Utils:
const handleAsyncError = require('../utils/handleAsyncErrors');

//Model:
const db = require('../models');
const { Op } = require('sequelize');

exports.findTemplates = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    let projectUuid = req.params.projectUuid;

    if (userId && projectUuid) {
        const currUser = await userfrontApi.get(`/v0/users/${userId}`);

        if (currUser) {
            let totalTemplates = await db.templateFile.findAll({
                where: {
                    templateCreatedBy: {
                        [Op.contains]: {
                            username: `${currUser.data.username}`,
                            userImage: `${currUser.data.image}`,
                            userfrontUserId: `${userId}`,
                        },
                    },
                    projectDetails: {
                        [Op.contains]: { projectUuid: `${projectUuid}` },
                    },
                },
                order: ['createdAt'],
            });

            if (totalTemplates) {
                return res.status(200).json({
                    status: 'Success',
                    templates: totalTemplates,
                });
            }

            return res.status(500).json({
                status: 'Failed',
                msg: 'Failed to retrieve templates.',
            });
        }
    }

    return res.status(500).json({
        status: 'Failed',
        msg: 'An error occurred finding templates.',
    });
});

exports.addTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { templateDetails } = req.body;

    let templateBody = { ...templateDetails };
    let currUser = await userfrontApi.get(`/v0/users/${userId}`);

    if (currUser && userId) {
        templateBody.templateCreatedBy = {
            userfrontUserId: `${userId}`,
            username: currUser.data.username,
            userImage: currUser.data.image,
        };
        templateBody.updatedAt = new Date();
        templateBody.createdAt = new Date();

        const addedTemplate = await db.templateFile.create(templateBody);
        let totalTemplates = await db.templateFile.findAll({
            where: {
                templateCreatedBy: {
                    [Op.contains]: {
                        userfrontUserId: `${userId}`,
                        username: currUser.data.username,
                        userImage: currUser.data.image,
                    },
                },
            },
            order: ['createdAt'],
        });

        if (addedTemplate && totalTemplates) {
            return res.status(200).json({
                status: 'Success',
                templates: totalTemplates,
            });
        }
    }

    return res.status(500).json({
        status: 'Failed',
        msg: 'An error occurred adding template file',
    });
});

exports.updateTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { templateDetails } = req.body;
    let templateId = req.params.templateId;

    let newTemplateDetails = { ...templateDetails };
    newTemplateDetails.updatedDate = new Date();

    if (userId && templateId) {
        let currUser = await userfrontApi.get(`/v0/users/${userId}`);

        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            await targetTemplate.update(newTemplateDetails);
            await targetTemplate.save();

            let totalTemplates = await db.templateFile.findAll({
                where: {
                    templateCreatedBy: {
                        [Op.contains]: {
                            userfrontUserId: `${userId}`,
                            username: currUser.data.username,
                            userImage: currUser.data.image,
                        },
                    },
                },
                order: ['createdAt'],
            });

            if (totalTemplates) {
                return res.status(200).json({
                    status: 'Success',
                    templates: totalTemplates,
                });
            }
        } catch (err) {
            return res.status(500).json({
                status: 'Failed',
                msg: 'An error occurred retrieving user templates',
            });
        }
    }
    return res.status(500).json({
        status: 'Failed',
        msg: 'An error occurred--no credentials provided',
    });
});

exports.deleteTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
});
