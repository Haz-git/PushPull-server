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

exports.findViewTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {
    const templateId = req.params.templateId;

    //I'm leaning towards everyone being able to access viewTemplates. TODO: Make viewTemplates accessable even without creating an account.

    // This finds the view template by its ID
    // const targetViewTemplate = await db.viewTemplate.findByPk(viewTemplateId);

    // Find viewTemplate via templateFileId
    const targetViewTemplate = await db.viewTemplate.findOne({
        where: {
            templateFileId: templateId,
        },
    });

    if (!targetViewTemplate) {
        return res.status(404).json({
            status: 'Failed',
            msg: 'View template not found',
        });
    }

    return res.status(200).json({
        status: 'Success',
        viewTemplate: targetViewTemplate,
    });
});

exports.addViewTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { composedViewTemplate } = req.body;
    const { userId } = req.auth;

    //Check if user adding view template owns the builder template:

    const doesUserOwnTemplate = verifyUserForTemplateAccess(
        userId.toString(),
        composedViewTemplate.savedTemplate.templateCreatedBy.userfrontUserId,
    );

    if (!composedViewTemplate || !userId || !doesUserOwnTemplate) {
        return res.status(401).json({
            status: 'Failed',
            msg: 'Access Denied: User submitting view template does not own template',
        });
    }

    await db.viewTemplate.create(composedViewTemplate);

    const targetViewTemplate = await db.viewTemplate.findByPk(composedViewTemplate.id);

    if (targetViewTemplate) {
        return res.status(200).json({
            status: 'Success',
            viewTemplate: targetViewTemplate,
        });
    }

    return res.status(500).json({
        status: 'Failed',
        msg: 'An error occurred returning added view template',
    });
});

exports.updateViewTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.deleteViewTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {});
