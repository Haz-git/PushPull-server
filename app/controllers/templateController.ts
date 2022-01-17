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
        templateBody.templateFileDesc = '';
        templateBody.templateWeightUnit = 'LBS';
        templateBody.updatedAt = new Date();
        templateBody.createdAt = new Date();
        templateBody.isDraft = true;
        templateBody.isPublished = false;
        templateBody.templateEditingSurfaceBlocks = [
            {
                weekId: `${uuid()}`,
                weekName: 'Untitled Week',
                weekContent: {
                    'Day 1': [],
                    'Day 2': [],
                    'Day 3': [],
                    'Day 4': [],
                    'Day 5': [],
                    'Day 6': [],
                    'Day 7': [],
                },
            },
        ];
        templateBody.templateToolbarBlocks = [];
        templateBody.templateLegend = [];
        templateBody.templateUserInputs = [];

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

//Template Building page requests:

exports.queryTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {
    let templateId = req.params.templateId;

    if (templateId) {
        let targetTemplate = await db.templateFile.findByPk(templateId);
        if (targetTemplate) {
            return res.status(200).json({
                status: 'Success',
                template: targetTemplate,
            });
        }
    }

    return res.status(500).json({
        status: 'Failed',
        msg: 'An error occurred querying template',
    });
});

exports.addToolbarBlocks = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { blockDetails } = req.body;
    let templateId = req.params.templateId;

    let newBlockDetails = { ...blockDetails, id: uuid(), prefix: 'Blocks' };

    if (userId && templateId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateToolbarBlocks } = targetTemplate?.dataValues;
            let updatedBlockList;

            if (templateToolbarBlocks !== null) {
                updatedBlockList = [...templateToolbarBlocks, newBlockDetails];
            } else {
                updatedBlockList = [];
                updatedBlockList.push(newBlockDetails);
            }

            await targetTemplate.update({ templateToolbarBlocks: updatedBlockList });
            await targetTemplate.save();

            let updatedTemplate = await db.templateFile.findByPk(templateId);
            if (updatedTemplate) {
                return res.status(200).json({
                    status: 'Success',
                    template: targetTemplate,
                });
            }
        } catch (err) {
            console.log(err);
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

exports.addEditingSurfaceBlocks = handleAsyncError(async (req: any, res: Response, next: any) => {
    //Handle adding blocks moved from toolbar to editing surface.
    const { userId } = req.auth;
    const { blockDetails } = req.body;
    let templateId = req.params.templateId;

    const { weekId, weekContent } = blockDetails;

    if (userId && templateId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;
            let newWeekContent = { ...weekContent };
            let targetWeekIdx = templateEditingSurfaceBlocks.findIndex((weekObject) => weekObject.weekId === weekId);

            if (targetWeekIdx !== -1) {
                targetTemplate.dataValues.templateEditingSurfaceBlocks[targetWeekIdx]['weekContent'] = newWeekContent;
                //According to: https://sequelize.org/master/manual/upgrade-to-v6.html, Deeply nested JSON property changes
                //Will need .changed() to denote change...
                targetTemplate.changed('templateEditingSurfaceBlocks', true);
                await targetTemplate.save();

                let updatedTemplate = await db.templateFile.findByPk(templateId);
                if (updatedTemplate) {
                    return res.status(200).json({
                        status: 'Success',
                        template: targetTemplate,
                    });
                }
            } else {
                return res.status(500).json({
                    status: 'Failed',
                    msg: 'An error occurred finding week id',
                });
            }
        } catch (err) {
            console.log(err);
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

exports.deleteEditingSurfaceBlocks = handleAsyncError(async (req: any, res: Response, next: any) => {
    let templateId = req.params.templateId;
    const { weekId, blockId, columnPrefix } = req.query;

    if (templateId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;
            const targetWeekIdx = templateEditingSurfaceBlocks.findIndex((weekObject) => weekObject.weekId === weekId);

            if (targetWeekIdx !== -1) {
                let targetColumn =
                    targetTemplate.dataValues.templateEditingSurfaceBlocks[targetWeekIdx]['weekContent'][columnPrefix];
                let deletionBlockIdx = targetColumn.findIndex((block) => block.id === blockId);
                targetTemplate.dataValues.templateEditingSurfaceBlocks[targetWeekIdx]['weekContent'][
                    columnPrefix
                ].splice(deletionBlockIdx, 1);

                targetTemplate.changed('templateEditingSurfaceBlocks', true);
                await targetTemplate.save();

                let updatedTemplate = await db.templateFile.findByPk(templateId);
                if (updatedTemplate) {
                    return res.status(200).json({
                        status: 'Success',
                        template: targetTemplate,
                    });
                }
            }

            return res.status(500).json({
                status: 'Failed',
                msg: 'An error occurred finding week id',
            });
        } catch (err) {
            console.warn(err);
            return res.status(500).json({
                status: 'Failed',
                msg: 'An error occurred performing delete operation on surface block',
            });
        }
    }

    return res.status(500).json({
        status: 'Failed',
        msg: 'An error occurred--no templateId provided',
    });
});

exports.deleteToolbarBlocks = handleAsyncError(async (req: any, res: Response, next: any) => {
    let templateId = req.params.templateId;
    let blockId = req.query.blockId;

    if (templateId && blockId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateToolbarBlocks } = targetTemplate?.dataValues;
            const deletionBlockIdx = templateToolbarBlocks.findIndex((block) => block.id === blockId);

            let modifiedToolbarBlocks = [...templateToolbarBlocks];
            modifiedToolbarBlocks.splice(deletionBlockIdx, 1);

            await targetTemplate.update({ templateToolbarBlocks: modifiedToolbarBlocks });
            await targetTemplate.save();

            let updatedTemplate = await db.templateFile.findByPk(templateId);
            if (updatedTemplate) {
                return res.status(200).json({
                    status: 'Success',
                    template: targetTemplate,
                });
            }
        } catch (err) {
            console.warn(err);
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
