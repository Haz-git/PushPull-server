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

        let currUser = await userfrontApi.get(`/v0/users/${userId}`);

        if (currUser) {
            const currDataObject = currUser?.data?.data;

            currDataObject.userBio = newBio;
            currDataObject.location = newLocation;
            currDataObject.website = newWebsite;
            currDataObject.twitter = newTwitter;

            const payload = {
                name: newName,
                data: currDataObject,
            };

            let response = await userfrontApi.put(`/v0/users/${userId}`, payload);

            return res.status(200).json({
                status: 'Success',
                userProfile: response.data,
            });
        }
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'User could not be updated',
    });
});

exports.updateUserAvatar = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { avatarObject } = req.body;
    const { userId } = req.auth;

    const { file, fileName } = avatarObject || {};

    if (file && fileName) {
        let imageKitResult = await imagekit.upload({
            file: file, //required
            fileName: fileName, //required
            extensions: [
                {
                    name: 'google-auto-tagging',
                    maxTags: 5,
                    minConfidence: 95,
                },
            ],
        });

        if (imageKitResult) {
            let currUser = await userfrontApi.get(`/v0/users/${userId}`);
            const { url } = imageKitResult;
            if (currUser) {
                const currDataObject = currUser?.data?.data;

                currDataObject.imageKitAvatarDetails = imageKitResult;
                //Logical nullish assignment, if imageKitAvatarDetails is undefined, it is created and assigned to imageKitResult.

                const payload = {
                    image: url,
                    data: currDataObject,
                };

                let response = await userfrontApi.put(`/v0/users/${userId}`, payload);

                return res.status(200).json({
                    status: 'Success',
                    userProfile: response.data,
                });
            }
        }
    }

    return res.status(500).json({
        status: 'Failure',
        msg: 'User avatar could not be updated',
    });
});

exports.updateUserReviewVotes = handleAsyncError(async (req: any, res: Response, next: any) => {
    const { userId } = req.auth;
    const { reviewObject } = req.body;

    const { reviewId, reviewTask, reviewVote } = reviewObject;

    if (reviewId && reviewTask && reviewVote) {
        let currUser = await userfrontApi.get(`/v0/users/${userId}`);

        const currDataObject = currUser?.data?.data;

        let newReviewObject = currDataObject.reviewsVoted;

        switch (reviewTask) {
            case 'ADD':
                newReviewObject[reviewId] = reviewVote;
                break;
            case 'DELETE':
                delete newReviewObject[reviewId];
            case 'UPDATE':
                newReviewObject[reviewId] = reviewVote;
            default:
                throw new Error('No review task was specified');
        }

        currDataObject.reviewsVoted = newReviewObject;

        const payload = {
            data: currDataObject,
        };

        let response = await userfrontApi.put(`/v0/users/${userId}`, payload);

        return res.status(200).json({
            status: 'Success',
            userDetails: response.data,
        });
    }
});
