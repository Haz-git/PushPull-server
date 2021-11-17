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

            console.log(builder);

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

exports.addProject = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.updateProject = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.deleteProject = handleAsyncError(async (req: any, res: Response, next: any) => {
    let projectId = req.params.projectId;
});
