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
});

exports.addTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { templateDetails } = req.body;

    let templateBody = { ...templateDetails };
    let currUser = await userfrontApi.get(`/v0/users/${userId}`);

    if (currUser && userId) {
        templateBody.id = uuid();
        templateBody.templateCreatedBy = {
            userfrontUserId: `${userId}`,
            createdDate: new Date(),
            username: currUser.data.username,
            userImage: currUser.data.image,
        };
        templateBody.updatedAt = new Date();
    }
});

exports.updateTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.deleteTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
});
