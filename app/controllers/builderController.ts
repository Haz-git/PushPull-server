import { Request, Response } from 'express';
const { v4: uuid } = require('uuid');

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
            } else {
                //builder is undefined, this account doesn't have builder (old account) -> we'll update.
                let currDataObject = currUser?.data?.data;
                currDataObject.builder = {
                    projects: [],
                };
                const payload = {
                    data: currDataObject,
                };
                let response = await userfrontApi.put(`/v0/users/${userId}`, payload);
                let updatedUser = await userfrontApi.get(`/v0/users/${userId}`);
                const { builder } = updatedUser?.data?.data;
                if (builder) {
                    return res.status(200).json({
                        status: 'Success',
                        msg: 'Builder was not found in user data. Builder has been created.',
                        builder: builder,
                    });
                }
            }
        }
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'User builder information could not be found',
    });
});

exports.addProject = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { projectDetails } = req.body;

    let projectBody = { ...projectDetails };
    let currUser = await userfrontApi.get(`/v0/users/${userId}`);
    let currDataObject = currUser?.data?.data;

    if (currDataObject) {
        projectBody.projectUuid = uuid();
        projectBody.createdBy = {
            userfrontUserId: userId,
            createdDate: new Date(),
            username: currUser.username,
            userImage: currUser.image,
        };
        projectBody.updatedDate = new Date();
        projectBody.projectMembers = [{ userfrontUserId: userId, mode: 'EDIT' }];
        projectBody.projectColorHex = Math.floor(Math.random() * 16777215).toString(16);
        projectBody.projectTemplates = [];

        currDataObject.builder.projects.push(projectBody);

        const payload = {
            data: currDataObject,
        };
        let response = await userfrontApi.put(`/v0/users/${userId}`, payload);
        let updatedUser = await userfrontApi.get(`/v0/users/${userId}`);

        if (response && updatedUser) {
            const { builder } = updatedUser?.data?.data;

            return res.status(200).json({
                status: 'Success',
                builder: builder,
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

exports.updateProject = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.deleteProject = handleAsyncError(async (req: any, res: Response, next: any) => {
    let projectId = req.params.projectId;
});
