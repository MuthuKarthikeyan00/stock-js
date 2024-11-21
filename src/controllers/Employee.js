const Sanitizer = require("../helpers/Sanitizer");
const Utils = require("../helpers/Utils");
const ResponseHandler = require("../helpers/ResponseHandler");
const Validator = require("../validator/Validator");
const { employeeValidationSchema } = require("../validator/schema");
const { Op } = require("sequelize");
const db = require("../models");
const EmployeeRole = require("./EmployeeRole");
const EmployeeBranch = require("./EmployeeBranch");

class Employee {
  static async render(req, res) {
    const roles = await EmployeeRole.fetch();
    const branches = await EmployeeBranch.fetch();

    let data;
    let id = Utils.convertTONumber(req.params.id);
    if (Utils.isGraterthenZero(id)) {
      data = await db.Employee.findOne({
        where: {
          id
        },
      });
    }

    return res.status(200).render('employee', {
      data,
      roles,
      branches
    });
  }

  static async handleData(body) {
    return Sanitizer.sanitizeHtml({
      name: String(body.name),
      email: String(body.email),
      phone: Number(body.phone),
      branchId: Number(body.branchId),
      roleId: Number(body.roleId),
    });
  }

  static async create(req, res) {
    try {
      const body = req.body;
      const args = await Employee.handleData(body);
      const status = await Validator.validate(args, employeeValidationSchema, res);
      if (!status) {
        return ResponseHandler.error(res);
      }
      const data = await db.Employee.create({
        name: args.name,
        email: args.email,
        phone: args.phone,
        roleId: args.roleId,
        branchId: args.branchId
      });

      if (Utils.isGraterthenZero(data.id)) return res.status(201).redirect('/employee');
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

      const args = await Employee.handleData(body);
      const status = await Validator.validate(args, employeeValidationSchema, res);
      if (!status) {
        return ResponseHandler.error(res);
      }


      const isValid = await db.Employee.findOne({
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

      const updated_id = await db.Employee.update(args, {
        where: {
          id,
        }
      });

      if (Utils.isGraterthenZero(updated_id[0])) return res.status(201).redirect('/employee');
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

      const isValid = await db.Employee.findOne({
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

      const updated_id = await db.Employee.update({ isDeleted: 1 }, {
        where: {
          id,
        }
      });

      if (Utils.isGraterthenZero(updated_id[0])) return res.status(201).redirect('/employee');
      return ResponseHandler.error(res);
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  static async getEmployees(req, res) {
    try {
      let { offset, limit, draw, search, orderColumn, orderDir } = req.body;
      const searchValue = search?.value || '';
      const order = req.body.order;
      const orderBy = order?.columns[orderColumn]?.data;
      orderColumn = orderBy || "id";
      orderDir = orderDir || "desc";

      const whereClause = {
        isDeleted: 0,
        ...(searchValue && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchValue}%` } },
          ],
        }),
      };

      const { count, rows } = await db.Employee.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: limit,
        order: [[String(orderColumn), String(orderDir)]],
        include: [
          {
            model: db.EmployeeBranch,
            as: 'employeeBranch',
            attributes: [['name', 'employeeBranchName']],
            required: false
          },
          {
            model: db.EmployeeRole,
            as: 'employeeRole',
            attributes: [['name', 'employeeRoleName']],
            required: false
          }
        ],
        raw: true
      });

      const data = rows.map((row) => {
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          roleId: row['employeeRole.employeeRoleName'],
          branchId: row['employeeBranch.employeeBranchName'],
        };
      });

      res.json({
        draw: draw,
        recordsTotal: count,
        recordsFiltered: count,
        data,
      });

    } catch (error) {
      ResponseHandler.error(res, error);
    }
  }

  static async fetch(args = {}) {
    const search = args?.search || '';

    const employees = await db.Employee.findAll({
      attributes: [
        ['id', 'value'],
        ['name', 'label']
      ],
      where: {
        isDeleted: 0,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
        ]
      },
      raw: true
    });

    return employees;
  }
}

module.exports = Employee;
