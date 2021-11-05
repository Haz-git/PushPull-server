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
