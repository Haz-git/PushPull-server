exports.verifyUserForTemplateAccess = (requestingUserId: string, templateOwner: string): boolean => {
    return requestingUserId === templateOwner;
};
