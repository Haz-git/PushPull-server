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

exports.findViewTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {});

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
