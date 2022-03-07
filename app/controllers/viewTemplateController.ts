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

exports.addViewTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.updateViewTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {});

exports.deleteViewTemplate = handleAsyncError(async (req: any, res: Response, next: any) => {});
