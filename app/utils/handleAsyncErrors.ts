//Preventing the need of a try/catch block with every request handler.
//The .catch portion catches any errors that tosses it to the error handler.

module.exports = (fn: (arg0: any, arg1: any, arg2: any) => Promise<any>) => {
    return (req: any, res: any, next: ((reason: any) => PromiseLike<never>) | null | undefined) => {
        fn(req, res, next).catch(next);
    };
};
