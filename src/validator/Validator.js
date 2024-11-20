const ResponseHandler = require('../helpers/ResponseHandler');
const { z, ZodSchema } = require('zod');

class Validator {

  static async validate(params, schema, res) {
    try {
      schema.parse(params);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ResponseHandler.error(res, error, 400, 'Validation failed');
      } else {
        return ResponseHandler.error(res, error, 400, 'Validation failed');
      }
    }
  }
}

module.exports = Validator;
