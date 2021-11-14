import { Request, Response } from 'express';
const ImageKit = require('imagekit');

//USERFRONT API:
const userfrontApi = require('../api/userfrontApi');

//IMAGEKIT SDK:
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

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

exports.updateUserAvatar = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { avatarObject } = req.body;
    const { userId } = req.auth;

    console.log(avatarObject);

    return res.status(200).json({
        msg: 'test',
    });
});
