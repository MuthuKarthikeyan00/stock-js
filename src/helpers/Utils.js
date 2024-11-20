const { Request, Response, NextFunction } = require('express');

class Utils {

    static isString(param) {
        return typeof param === 'string';
    }

    static isNumber(param) {
        return typeof param === 'number' || typeof param === 'bigint';
    }

    static isBoolean(param) {
        return typeof param === 'boolean';
    }

    static isArray(param) {
        return Array.isArray(param);
    }

    static isObject(param) {
        return typeof param === 'object';
    }

    static isEmpty(param) {
        return param == '';
    }

    static isNull(param) {
        return param == '';
    }

    static isUndefined(param) {
        return param == undefined;
    }

    static isGraterthenZero(param) {
        return this.isNumber(param) && Number(param) > 0;
    }

    static isValid(param) {
        return this.isEmpty(param) && this.isNull(param) && this.isUndefined(param);
    }

    static toLowerCase(param) {
        return param.toLowerCase();
    }

    static toUpperCase(param) {
        return param.toUpperCase();
    }

    static checkRequestMethod(req, method) {
        return req.method === this.toUpperCase(method);
    }

    static getHttpParam(req, key, method = 'PUT') {
        if (!this.checkRequestMethod(req, method) || !req.params[key] || !this.isGraterthenZero(req.params[key])) {
            return 0;
        }
        return Number(req.params[key]);
    }

    static convertTONumber(param) {
        param = this.isNumber(param) ? param : Number(param);
        return this.isNumber(param) ? Number(param) : 0;
    }

    static dateFormat(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }

    static removeNullPrototype(req, res, next) {
        req.body = Object.assign({}, req.body);
        next();
    }
}

// Export the class and function
module.exports = {
    Utils,
    removeNullPrototype: (req, res, next) => {
        req.body = Object.assign({}, req.body);
        next();
    }
};
