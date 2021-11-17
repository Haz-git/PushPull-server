import { Request, Response } from 'express';

//USERFRONT API:
const userfrontApi = require('../api/userfrontApi');

//Utils:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.findUserBuilderInfo = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;

    if (userId) {
        let currUser = await userfrontApi.get(`/v0/users/${userId}`);

        if (currUser) {
            const { builder } = currUser?.data?.data;

            if (builder) {
                return res.status(200).json({
                    status: 'Success',
                    builder: builder,
                });
            }
        }
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'User builder information could not be found',
    });
});

exports.addProject = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.updateProject = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.deleteProject = handleAsyncError(async (req: any, res: Response, next: any) => {
    let projectId = req.params.projectId;
});
