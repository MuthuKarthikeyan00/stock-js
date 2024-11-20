const JSONbig = require('json-bigint');

class ResponseHandler {

    static success(res, code = 200, data = {}, message = '') {
        code = code || 200;
        message = message || '';
        data = data || [];

        res.status(code);
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSONbig.stringify({ success: true, message, data }));
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
