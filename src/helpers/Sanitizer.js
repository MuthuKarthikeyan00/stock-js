const sanitizer = require('sanitizer');

class Sanitizer {

    static escape(text) {
        return sanitizer.escape(String(text));
    }

    static sanitize(text) {
        return sanitizer.sanitize(String(text));
    }
}

module.exports = Sanitizer;
