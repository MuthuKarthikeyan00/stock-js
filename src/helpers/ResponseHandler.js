

class ResponseHandler {

    static success(res, code = 200, data = {}, message = '') {
        code = code || 200;
        message = message || '';
        data = data || [];


        return res.status(code).json({
            status: code,
            message,
            error
        });
    }

    static error(res, error = {}, code = 200, message = '') {
        console.log({ error: error });

        code = code || 200;
        message = message || '';

        return res.status(code).json({
            status: code,
            message,
            error
        });
    }

}

module.exports = ResponseHandler;
