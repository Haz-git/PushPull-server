import { Request, Response } from 'express';

//USERFRONT API:
const userfrontApi = require('../api/userfrontApi');

//Utils:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.findUserBuilderInfo = handleAsyncError(async (req: any, res: Response, next: any) => {
    let userId = req.params.userId;
});

exports.addProject = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.updateProject = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.deleteProject = handleAsyncError(async (req: any, res: Response, next: any) => {
    let projectId = req.params.projectId;
});
