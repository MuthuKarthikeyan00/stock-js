const Sanitizer = require("../helpers/Sanitizer");
const Utils = require("../helpers/Utils");
const { EmployeeRole: EmployeeRoleModel } = require("../models/EmployeeRole");
const ResponseHandler = require("../helpers/ResponseHandler");
const Validator = require("../validator/Validator");
const { employeeRoleValidationSchema } = require("../validator/schema");
const { Op } = require("sequelize");

class EmployeeRole {
  static async render(req, res) {
    let data;
    let id = Utils.convertTONumber(req.params.id);
    if (Utils.isGraterthenZero(id)) {
      data = await EmployeeRoleModel.findOne({
        where: {
          id
        },
      })
    }
    return res.status(200).render('employeeRole', {
      data
    });
  }

  static async handleData(body) {
    return Sanitizer.sanitizeHtml({
      name: String(body.name),
    });
  }

  static async create(req, res) {
    try {
      const status = await Validator.validate(req.body, employeeRoleValidationSchema, res)
      if (!status) {
        return ResponseHandler.error(res);
      }
      const body = req.body;
      const args = await EmployeeRole.handleData(body);

      const data = await EmployeeRoleModel.create({
        name: args.name,
        createdAt: new Date().toISOString(),
      });

      if (Utils.isGraterthenZero(data.id)) return res.status(201).redirect('/employeeRole'); 
      return ResponseHandler.error(res);

    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  static async update(req, res) {
    try {
      const body = req.body;
      const id = Number(req.params.id);

      if (!Utils.isGraterthenZero(id)) {
        return ResponseHandler.error(
          res, {},
          400,
          "invalid id"
        );
      }
      const status = await Validator.validate(req.body, employeeRoleValidationSchema, res)
      if (!status) {
        return ResponseHandler.error(res);
      }
      const args = await EmployeeRole.handleData(body);
      args.updatedAt = new Date().toISOString();

      const isValid = await EmployeeRoleModel.findOne({
        where: {
          id,
        },
      });
      if (!isValid) {
        return ResponseHandler.error(
          res, {},
          400,
          "invalid id"
        );
      }

      const updated_id = await EmployeeRoleModel.update(args, {
        where: {
          id,
        }
      });

      if (Utils.isGraterthenZero(updated_id[0])) return res.status(201).redirect('/employeeRole');
      return ResponseHandler.error(res);
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  static async delete(req, res) {
    try {
      const body = req.body;
      const id = Number(req.params.id);

      if (!Utils.isGraterthenZero(id)) {
        return ResponseHandler.error(
          res, {},
          400,
          "invalid id"
        );
      }

      const isValid = await EmployeeRoleModel.findOne({
        where: {
          id,
        },
      });
      if (!isValid) {
        return ResponseHandler.error(
          res, {},
          400,
          "invalid id"
        );
      }

      const updated_id = await EmployeeRoleModel.update({isDeleted: 1}, {
        where: {
          id,
        }
      });

      if (Utils.isGraterthenZero(updated_id[0])) return res.status(201).redirect('/employeeRole');
      return ResponseHandler.error(res);
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  static async getEmployeeRole(req, res) {
    try {
      let { offset, limit, draw, search, orderColumn, orderDir } = req.body;
      const searchValue = search?.value || ''; 
      const order = req.body.order;
      const orderBy = order?.columns[orderColumn]?.data;
      orderColumn = orderBy || "id";
      orderDir = orderDir || "desc";

      const whereClause = {
        isDeleted: null,  
        ...(searchValue && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchValue}%` } },
          ],
        }),
      };

      const data = await EmployeeRoleModel.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: limit,
        order: [[String(orderColumn), String(orderDir)]], 
      });

      res.json({
        draw: draw,
        recordsTotal: data.count,
        recordsFiltered: data.count,
        data: data.rows,
      });
    } catch (error) {
      // Handle error if necessary
    }
  }

  static async fetch(args = {}) {
    const search = args?.search || '';

    const assetCategories = await EmployeeRoleModel.findAll({
      attributes: [
        ['id', 'value'],
        ['name', 'label']
      ],
      where: {
        isDeleted: {
          [Op.is]: null
        },
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
        ]
      },
      raw: true
    });

    return assetCategories;
  }
}

module.exports = EmployeeRole;
