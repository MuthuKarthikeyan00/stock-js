const sanitizer = require('sanitizer');

class Sanitizer {

    static escape(text) {
        return sanitizer.escape(text);
    }

    static sanitize(text) {
        return sanitizer.sanitize(text);
    }

    static sanitizeString(text) {
        return Sanitizer.sanitize(Sanitizer.escape(String(text)));
    }

    static async sanitizeHtml(params, exclude = []) {
        Object.keys(params).forEach((key) => {
            if (params.hasOwnProperty(key) && typeof params[key] === 'string' && !exclude.includes(key)) {
                params[key] = Sanitizer.sanitizeString(params[key]);
            }
        });
        return params;
    }
}

module.exports = Sanitizer;
