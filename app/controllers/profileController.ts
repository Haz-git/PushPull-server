import { Request, Response } from 'express';

//api:
const userfrontApi = require('../api/userfrontApi');

//Utils:
const handleAsyncError = require('../utils/handleAsyncErrors');

exports.findUser = handleAsyncError(async (req: Request, res: Response, next: any) => {
    let username = req.params.username;

    if (username) {
        const payload = {
            filters: {
                conjunction: 'and',
                filterGroups: [
                    {
                        conjunction: 'and',
                        filters: [
                            {
                                attr: 'username',
                                type: 'string',
                                comparison: 'is',
                                value: `${username}`,
                            },
                        ],
                    },
                ],
            },
        };

        let response = await userfrontApi.post('/v0/users/find', payload);

        if (response && response?.data?.totalCount === 0) {
            return res.status(200).json({
                status: 'Failure',
                msg: 'User not found',
                userProfile: 0,
            });
        }

        return res.status(200).json({
            status: 'Success',
            userProfile: response.data.results[0],
        });
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'User could not be found',
    });
});

exports.updateUser = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { updateObject } = req.body;
    const { userId } = req.auth;

    if (updateObject && userId) {
        const { newName, newBio, newLocation, newWebsite, newTwitter } = updateObject;

        const payload = {
            name: newName,
            data: {
                userBio: newBio,
                location: newLocation,
                website: newWebsite,
                twitter: newTwitter,
            },
        };

        let response = await userfrontApi.put(`/v0/users/${userId}`, payload);

        return res.status(200).json({
            status: 'Success',
            userProfile: response.data,
        });
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'User could not be updated',
    });
});
