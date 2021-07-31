'use strict'

class Util {
    handleError(res, err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json(this.formatError(err.error));
        } else {
            return res.status(500).json(this.formatError(err));
        }
    }
    formatError(err) {
        if (err instanceof Error) {
            return {
                error: err.message,
                stack: err.stack
            }
        } else if (typeof err == 'string') {
            return {
                error: err
            }
        } else if (typeof err == 'object') {
            return err;
        } return {
            error: "Some error occured"
        }
    }
}


module.exports = Util;