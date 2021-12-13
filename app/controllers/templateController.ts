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
    //This projectUuid could be a uuidV4, or a dashboard view (for projects for dashboard views like recents, published, and drafts).
    let projectUuid = req.params.projectUuid;

    if (userId && projectUuid) {
        const currUser = await userfrontApi.get(`/v0/users/${userId}`);

        if (currUser) {
            let totalTemplates;

            if (projectUuid !== 'recents' && projectUuid !== 'published' && projectUuid !== 'drafts') {
                totalTemplates = await db.templateFile.findAll({
                    where: {
                        templateCreatedBy: {
                            [Op.contains]: {
                                username: `${currUser.data.username}`,
                                userfrontUserId: `${userId}`,
                            },
                        },
                        projectId: `${projectUuid}`,
                    },
                    order: ['createdAt'],
                });
            } else if (projectUuid === 'recents') {
                totalTemplates = await db.templateFile.findAll({
                    where: {
                        templateCreatedBy: {
                            [Op.contains]: {
                                username: `${currUser.data.username}`,
                                userfrontUserId: `${userId}`,
                            },
                        },
                    },
                    order: [['updatedAt', 'DESC']],
                });
            } else if (projectUuid === 'published') {
                totalTemplates = await db.templateFile.findAll({
                    where: {
                        templateCreatedBy: {
                            [Op.contains]: {
                                username: `${currUser.data.username}`,
                                userfrontUserId: `${userId}`,
                            },
                        },
                        isPublished: true,
                    },
                    order: ['createdAt'],
                });
            } else if (projectUuid === 'drafts') {
                totalTemplates = await db.templateFile.findAll({
                    where: {
                        templateCreatedBy: {
                            [Op.contains]: {
                                username: `${currUser.data.username}`,
                                userfrontUserId: `${userId}`,
                            },
                        },
                        isDraft: true,
                        isPublished: false,
                    },
                    order: ['createdAt'],
                });
            }

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
        };
        templateBody.updatedAt = new Date();
        templateBody.createdAt = new Date();
        templateBody.isDraft = true;
        templateBody.isPublished = false;

        const addedTemplate = await db.templateFile.create(templateBody);
        let totalTemplates = await db.templateFile.findAll({
            where: {
                templateCreatedBy: {
                    [Op.contains]: {
                        userfrontUserId: `${userId}`,
                        username: currUser.data.username,
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
    const { templateDetails, projectUuid } = req.body;
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
            let totalTemplates;

            if (!projectUuid) {
                totalTemplates = await db.templateFile.findAll({
                    where: {
                        templateCreatedBy: {
                            [Op.contains]: {
                                userfrontUserId: `${userId}`,
                                username: currUser.data.username,
                            },
                        },
                    },
                    order: ['createdAt'],
                });
            } else {
                totalTemplates = await db.templateFile.findAll({
                    where: {
                        templateCreatedBy: {
                            [Op.contains]: {
                                username: `${currUser.data.username}`,
                                userfrontUserId: `${userId}`,
                            },
                        },
                        projectId: `${projectUuid}`,
                    },
                    order: ['createdAt'],
                });
            }

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
    let templateId = req.params.templateId;
    let projectId = req.query.projectId;

    if (userId && templateId) {
        let currUser = await userfrontApi.get(`/v0/users/${userId}`);

        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            await targetTemplate.destroy();

            let totalTemplates;
            if (!projectId) {
                totalTemplates = await db.templateFile.findAll({
                    where: {
                        templateCreatedBy: {
                            [Op.contains]: {
                                userfrontUserId: `${userId}`,
                                username: currUser.data.username,
                            },
                        },
                    },
                    order: ['createdAt'],
                });
            } else {
                totalTemplates = await db.templateFile.findAll({
                    where: {
                        templateCreatedBy: {
                            [Op.contains]: {
                                username: `${currUser.data.username}`,
                                userfrontUserId: `${userId}`,
                            },
                        },
                        projectId: `${projectId}`,
                    },
                    order: ['createdAt'],
                });
            }

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
