import { Request, Response } from 'express';
const { v4: uuid } = require('uuid');
const { verifyUserForTemplateAccess } = require('../utils/verifyTemplateAccess');

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
    const { sheetId } = templateDetails;
    let currUser = await userfrontApi.get(`/v0/users/${userId}`);

    if (currUser && userId) {
        delete templateBody.sheetId;
        templateBody.templateCreatedBy = {
            userfrontUserId: `${userId}`,
            username: currUser.data.username,
        };
        templateBody.templateFileDesc = '';
        templateBody.templateWeightUnit = 'IMPERIAL';
        templateBody.updatedAt = new Date();
        templateBody.createdAt = new Date();
        templateBody.isDraft = true;
        templateBody.isPublished = false;
        templateBody.hasSavedViewTemplate = false;
        templateBody.templateEditingSurfaceBlocks = [
            {
                sheetId: `${sheetId}`,
                sheetName: 'Untitled Sheet',
                sheetOrder: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                sheetContent: {
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
    const templateId = req.params.templateId;
    const { userId } = req.auth;

    if (templateId && userId) {
        const targetTemplate = await db.templateFile.findByPk(templateId);
        if (
            !verifyUserForTemplateAccess(
                userId.toString(),
                targetTemplate?.dataValues?.templateCreatedBy?.userfrontUserId,
            )
        ) {
            return res.status(401).json({
                status: 'Failed',
                msg: 'Access Denied: User does not own template.',
            });
        }

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

exports.updateToolbarBlocks = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { blockDetails } = req.body;
    const templateId = req.params.templateId;
    const { blockId } = req.query;

    const isMissingRequiredArguments = !userId || !blockDetails || !templateId || !blockId;

    if (!isMissingRequiredArguments) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateToolbarBlocks } = targetTemplate?.dataValues;
            const targetBlockIndex = templateToolbarBlocks.findIndex((block) => block.id === blockId);

            targetTemplate.dataValues.templateToolbarBlocks[targetBlockIndex].blockDetails = blockDetails;

            targetTemplate.changed('templateToolbarBlocks', true);
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

    const { sheetId, sheetContent } = blockDetails;

    if (userId && templateId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;
            let newsheetContent = { ...sheetContent };
            let targetSheetIdx = templateEditingSurfaceBlocks.findIndex((weekObject) => weekObject.sheetId === sheetId);

            if (targetSheetIdx !== -1) {
                targetTemplate.dataValues.templateEditingSurfaceBlocks[targetSheetIdx]['sheetContent'] =
                    newsheetContent;
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

exports.updateEditingSurfaceBlocks = handleAsyncError(async (req: any, res: Response, next: any) => {
    //Handle adding blocks moved from toolbar to editing surface.
    const { userId } = req.auth;
    const { blockDetails } = req.body;
    const { templateId } = req.params;
    const { sheetId, blockId } = req.query;
    let { columnPrefix } = req.query;

    //Db stores columnPrefix with spaces. The column prefix sent into the server replaces all spaces with %20. We can't use decode URI here because we inserted a '%' prepending our secret. This gives a URI malformed.
    const decodedColumnPrefix = columnPrefix.replace(/%20/g, ' ');

    //req.query should contain sheetId and blockId.

    if (userId && templateId && sheetId && blockId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;
            const targetSheetIdx = templateEditingSurfaceBlocks.findIndex(
                (weekObject) => weekObject.sheetId === sheetId,
            );

            if (targetSheetIdx !== -1) {
                console.log(targetTemplate.dataValues.templateEditingSurfaceBlocks[targetSheetIdx].sheetContent);
                const targetBlockIndex = targetTemplate.dataValues.templateEditingSurfaceBlocks[
                    targetSheetIdx
                ].sheetContent[decodedColumnPrefix].findIndex((block) => block.id === blockId);

                targetTemplate.dataValues.templateEditingSurfaceBlocks[targetSheetIdx].sheetContent[
                    decodedColumnPrefix
                ][targetBlockIndex].blockDetails = blockDetails;

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
    const { sheetId, blockId } = req.query;
    let { columnPrefix } = req.query;

    const decodedColumnPrefix = columnPrefix.replace(/%20/g, ' ');

    if (templateId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;
            const targetSheetIdx = templateEditingSurfaceBlocks.findIndex(
                (weekObject) => weekObject.sheetId === sheetId,
            );

            if (targetSheetIdx !== -1) {
                let targetColumn =
                    targetTemplate.dataValues.templateEditingSurfaceBlocks[targetSheetIdx]['sheetContent'][
                        decodedColumnPrefix
                    ];
                let deletionBlockIdx = targetColumn.findIndex((block) => block.id === blockId);
                targetTemplate.dataValues.templateEditingSurfaceBlocks[targetSheetIdx]['sheetContent'][
                    decodedColumnPrefix
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

exports.reorderEditingSurfaceColumns = handleAsyncError(async (req: any, res: Response, next: any) => {
    const templateId = req.params.templateId;
    const { sheetId, newColumnOrder } = req.body.reorderDetails;

    if (templateId && sheetId && newColumnOrder) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;
            const targetSheetIdx = templateEditingSurfaceBlocks.findIndex(
                (weekObject) => weekObject.sheetId === sheetId,
            );

            targetTemplate.dataValues.templateEditingSurfaceBlocks[targetSheetIdx]['sheetOrder'] = newColumnOrder;

            targetTemplate.changed('templateEditingSurfaceBlocks', true);

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

exports.renameEditingSurfaceColumns = handleAsyncError(async (req: any, res: Response, next: any) => {
    const templateId = req.params.templateId;
    const { sheetId, oldColumnName, newColumnName } = req.body.renameDetails;

    if (templateId && sheetId && oldColumnName && newColumnName) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;
            const targetSheetIdx = templateEditingSurfaceBlocks.findIndex(
                (weekObject) => weekObject.sheetId === sheetId,
            );

            const orderIdx = templateEditingSurfaceBlocks[targetSheetIdx]['sheetOrder'].indexOf(oldColumnName);

            templateEditingSurfaceBlocks[targetSheetIdx]['sheetOrder'].splice(orderIdx, 1, newColumnName);

            const sheetContentObj = templateEditingSurfaceBlocks[targetSheetIdx]['sheetContent'];

            if (oldColumnName !== newColumnName) {
                Object.defineProperty(
                    sheetContentObj,
                    newColumnName,
                    Object.getOwnPropertyDescriptor(sheetContentObj, oldColumnName) as any,
                );

                delete sheetContentObj[oldColumnName];
            }

            targetTemplate.changed('templateEditingSurfaceBlocks', true);

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

exports.addEditingSurfaceSheet = handleAsyncError(async (req: any, res: Response, next: any) => {
    const templateId = req.params.templateId;

    if (templateId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;
            templateEditingSurfaceBlocks.push({
                sheetId: `${uuid()}`,
                sheetName: 'Untitled Sheet',
                sheetOrder: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                sheetContent: {
                    'Day 1': [],
                    'Day 2': [],
                    'Day 3': [],
                    'Day 4': [],
                    'Day 5': [],
                    'Day 6': [],
                    'Day 7': [],
                },
            });

            targetTemplate.changed('templateEditingSurfaceBlocks', true);
            await targetTemplate.save();
            const updatedTemplate = await db.templateFile.findByPk(templateId);

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

exports.updateEditingSurfaceSheet = handleAsyncError(async (req: any, res: Response, next: any) => {
    const templateId = req.params.templateId;
    const sheetId = req.query.sheetId;
    const updateObject = req.body;

    if (templateId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            let { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;

            const expectedSheetUpdateIndex = templateEditingSurfaceBlocks.findIndex(
                (sheet) => sheet.sheetId === sheetId,
            );

            //iterate through updateObject, set current values to the updated values inside update object.

            Object.keys(updateObject).forEach((key) => {
                templateEditingSurfaceBlocks[expectedSheetUpdateIndex][key] = updateObject[key];
            });

            targetTemplate.changed('templateEditingSurfaceBlocks', true);
            await targetTemplate.save();

            const updatedTemplate = await db.templateFile.findByPk(templateId);

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
exports.deleteEditingSurfaceSheet = handleAsyncError(async (req: any, res: Response, next: any) => {
    const templateId = req.params.templateId;
    const sheetId = req.query.sheetId;
    // const updateObject = req.query;

    if (templateId) {
        try {
            let targetTemplate = await db.templateFile.findOne({
                where: {
                    id: templateId,
                },
            });

            const { templateEditingSurfaceBlocks } = targetTemplate?.dataValues;

            const expectedSheetDeletionIndex = templateEditingSurfaceBlocks.findIndex(
                (sheet) => sheet.sheetId === sheetId,
            );

            templateEditingSurfaceBlocks.splice(expectedSheetDeletionIndex, 1);

            targetTemplate.changed('templateEditingSurfaceBlocks', true);
            await targetTemplate.save();

            const updatedTemplate = await db.templateFile.findByPk(templateId);

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
