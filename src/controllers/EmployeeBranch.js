const Sanitizer = require('../helpers/Sanitizer');
const Utils = require('../helpers/Utils');
const { EmployeeBranch: EmployeeBranchModel } = require('../models/EmployeeBranch');
const ResponseHandler = require('../helpers/ResponseHandler');
const Validator = require('../validator/Validator');
const { employeeRoleValidationSchema } = require('../validator/schema');
const { literal, Op } = require('sequelize');

class EmployeeBranch {
  static async render(req, res) {
    let data;
    let id = Utils.convertTONumber(req.params.id);
    if (Utils.isGraterthenZero(id)) {
      data = await EmployeeBranchModel.findOne({
        where: {
          id,
        },
      });
    }
    return res.status(200).render('employeeBranch', {
      data,
    });
  }

  static async handleData(body) {
    return Sanitizer.sanitizeHtml({
      name: String(body.name),
    });
  }

  static async create(req, res) {
    try {
      const status = await Validator.validate(req.body, employeeRoleValidationSchema, res);
      if (!status) {
        return ResponseHandler.error(res);
      }
      const body = req.body;
      const args = await EmployeeBranch.handleData(body);

      const data = await EmployeeBranchModel.create({
        name: args.name,
        createdAt: new Date().toISOString(),
      });

      if (Utils.isGraterthenZero(data.id)) return res.status(201).redirect('/employeeBranch');
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
        return ResponseHandler.error(res, {}, 400, 'invalid id');
      }
      const status = await Validator.validate(req.body, employeeRoleValidationSchema, res);
      if (!status) {
        return ResponseHandler.error(res);
      }
      const args = await EmployeeBranch.handleData(body);
      args.updatedAt = new Date().toISOString();

      const isValid = await EmployeeBranchModel.findOne({
        where: {
          id,
        },
      });
      if (!isValid) {
        return ResponseHandler.error(res, {}, 400, 'invalid id');
      }

      const updated_id = await EmployeeBranchModel.update(args, {
        where: {
          id,
        },
      });

      if (Utils.isGraterthenZero(updated_id[0])) return res.status(201).redirect('/employeeBranch');
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
        return ResponseHandler.error(res, {}, 400, 'invalid id');
      }

      const isValid = await EmployeeBranchModel.findOne({
        where: {
          id,
        },
      });
      if (!isValid) {
        return ResponseHandler.error(res, {}, 400, 'invalid id');
      }

      const updated_id = await EmployeeBranchModel.update({ isDeleted: 1 }, {
        where: {
          id,
        },
      });

      if (Utils.isGraterthenZero(updated_id[0])) return res.status(201).redirect('/employeeBranch');
      return ResponseHandler.error(res);
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  static async getEmployeeBranch(req, res) {
    try {
      let { offset, limit, draw, search, orderColumn, orderDir } = req.body;
      const searchValue = search?.value || '';
      const order = req.body.order;
      const orderBy = order?.columns[orderColumn]?.data;
      orderColumn = orderBy || 'id';
      orderDir = orderDir || 'desc';

      const whereClause = {
        isDeleted: null,
        ...(searchValue && {
          [Op.or]: [{ name: { [Op.iLike]: `%${searchValue}%` } }],
        }),
      };

      const data = await EmployeeBranchModel.findAndCountAll({
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
    } catch (error) {}
  }

  static async fetch(args = {}) {
    const search = args?.search || '';

    const assetCategories = await EmployeeBranchModel.findAll({
      attributes: [['id', 'value'], ['name', 'label']],
      where: {
        isDeleted: {
          [Op.is]: null,
        },
        [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
      },
      raw: true,
    });

    return assetCategories;
  }
}

module.exports = EmployeeBranch;
