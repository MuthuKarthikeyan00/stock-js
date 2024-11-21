const Sanitizer = require("../helpers/Sanitizer");
const Utils = require("../helpers/Utils");
const { Asset: AssetModel } = require("../models/Asset");
const ResponseHandler = require("../helpers/ResponseHandler");
const Validator = require("../validator/Validator");
const { AssetStatus: AssetStatusModel } = require("../models/AssetStatus");
const { AssetTransactionType: AssetTransactionTypeModel } = require("../models/AssetTransactionType");
const Asset = require("./Asset");
const { AssetTransactionValidationSchema } = require("../validator/schema");
const { Employee: EmployeeModel } = require("../models/Employee");
const AssetStatus = require("./AssetStatus");
const AssetTransactionType = require("./AssetTransactionType");
const { literal, Op, QueryTypes } = require("sequelize");
const Employee = require("./Employee");
const EmployeeBranch = require("./EmployeeBranch");
const AssetCategory = require("./AssetCategory");
const db = require("../models");

class AssetTransaction {

  static async issueRender(req, res) {
    const employees = await Employee.fetch();
    const assets = await Asset.fetch({ assetStatusIds: [1, 3] });

    return res.status(200).render('assetIssue', {
      employees,
      assets
    });
  }

  static async returnRender(req, res) {
    const assets = await Asset.fetch({ assetStatusIds: [2] });
    const assetTransactionIds = await AssetTransactionType.fetch({ assetTransactionIds: [2, 3, 4] });
    return res.status(200).render('assetReturn', {
      assets,
      assetTransactionIds
    });
  }

  static async scrapRender(req, res) {
    const assets = await Asset.fetch({ assetStatusIds: [2, 3] });

    return res.status(200).render('assetScrap', {
      assets
    });
  }

  static async assetsHistroyRender(req, res) {
    const assets = await Asset.fetch({});
    return res.status(200).render('assetsHistroy', {
      assets
    });
  }

  static async stockViewRender(req, res) {
    const employees = await Employee.fetch();
    const assets = await Asset.fetch({ assetStatusIds: [1, 2, 3] });
    const branches = await EmployeeBranch.fetch();
    const assetCategories = await AssetCategory.fetch();
    const assetStatuses = await AssetStatus.fetch({ ids: [1, 2, 3] });

    return res.status(200).render('stockView', {
      employees,
      assets,
      assetCategories,
      branches,
      assetStatuses,
    });
  }

  static async handleData(body) {
    return Sanitizer.sanitizeHtml({
      assetId: Number(body.assetId),
      assetStatusId: Number(body.assetStatusId),
      assetTransactionTypeId: body.assetTransactionTypeId ? Number(body.assetTransactionTypeId) : null,
      amount: body.amount ? Number(body.amount) : null,
      employeeId: body.employeeId ? Number(body.employeeId) : null,
    });
  }

  static async create(req, res) {
    try {
      const body = req.body;
      const args = await AssetTransaction.handleData(body);
      const status = await Validator.validate(args, AssetTransactionValidationSchema, res)
      if (!status) {
        return ResponseHandler.error(res);
      }
      args.createdAt = new Date().toISOString();

      const data = await db.AssetTransaction.create(args);
      if (Utils.isGraterthenZero(data.id)) {
        const updated_id = await AssetModel.update({
          assetStatusId: data.assetStatusId,
          employeeId: ([2].includes(args.assetStatusId)) ? data.employeeId : null
        }, {
          where: {
            id: data.assetId,
          }
        });
        return res.status(201).redirect('/stockView');
      }
      return ResponseHandler.error(res);
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  static async getAssetsHistory(req, res) {
    try {
      let { offset, limit, draw, search, orderColumn, orderDir, args } = req.body;
      const searchValue = search?.value || '';
      const order = req.body.order;
      const orderBy = order?.columns[orderColumn]?.data;
      orderColumn = !String(orderBy) || orderBy == 'assetId' ? 'createdAt' : String(orderBy);
      orderDir = String(orderDir) || "asc";
      const assetId = args?.assetId;

      if (!assetId) {
        return ResponseHandler.error(res,);
      }

      const { rows, count } = await db.AssetTransaction.findAndCountAll({
        attributes: [
          'id',
          'amount', 'createdAt',
        ],
        where: {
          assetId: assetId
        },
        include: [
          {
            model: AssetModel,
            attributes: [['name', 'assetId']],
            required: false
          },
          {
            model: EmployeeModel,
            attributes: [['name', 'employeeId']],
            required: false
          },
          {
            model: AssetStatusModel,
            attributes: [['name', 'assetStatusId']],
            required: false
          },
          {
            model: AssetTransactionTypeModel,
            attributes: [['name', 'assetTransactionTypeId']],
            required: false
          }
        ],
        order: [
          [orderColumn, orderDir],
        ],
        raw: true
      });

      const data = rows.map((row) => {
        return {
          assetId: row['asset.assetId'],
          amount: row.amount,
          employeeId: row['employee.employeeId'],
          assetStatusId: row['assetStatus.assetStatusId'],
          assetTransactionTypeId: row['assetTransactionType.assetTransactionTypeId'],
          createdAt: Utils.dateFormat(row.createdAt)
        };
      });
      res.json({
        draw: draw,
        recordsTotal: count,
        recordsFiltered: count,
        data
      });

    } catch (error) {
      return ResponseHandler.error(res,)
    }
  }

  static async getStockView(req, res) {
    try {
      let { offset, limit, draw, search, orderColumn, orderDir, args } = req.body;
      const searchValue = search?.value || '';
      const order = req.body.order;
      const orderBy = order?.columns[orderColumn]?.data;
      orderColumn = !String(orderBy) || orderBy == 'name' ? 'assets.createdAt' : String(orderBy);
      orderDir = String(orderDir) || "asc";

      const assetId = args?.assetId || null;
      const assetStatusId = args?.assetStatusId || null;
      const assetcategoryId = args?.assetcategoryId || null;
      const employeeId = args?.employeeId || null;
      const branchId = args?.branchId || null;

      let whereClause = `WHERE assets."assetStatusId" != 4 `;
      if (assetId > 0) {
        whereClause += ` AND assets.id = ${assetId}`;
      }
      if (assetStatusId > 0) {
        whereClause += ` AND assets."assetStatusId" = ${assetStatusId}`;
      }
      if (assetcategoryId > 0) {
        whereClause += ` AND assets."categoryId" = ${assetcategoryId}`;
      }
      if (employeeId > 0) {
        whereClause += ` AND assets."employeeId" = ${employeeId}`;
      }
      if (branchId > 0) {
        whereClause += ` AND employees."branchId" = ${branchId}`;
      }
      let orderByCon = '';

      if (orderByCon) {
        orderByCon = `ORDER BY `;
      }

      const query = `
        SELECT 
          assets.name AS "assetName",
          assets.model AS "assetModel",
          asset_categories.name AS "categoryName",
          asset_statuses.name AS "statusName",
          employees.name AS "employeeName",
          employee_branches.name AS "branchName"
        FROM assets
        LEFT JOIN asset_categories ON asset_categories.id = assets."categoryId"
        LEFT JOIN asset_statuses ON asset_statuses.id = assets."assetStatusId"
        LEFT JOIN employees ON employees.id = assets."employeeId"
        LEFT JOIN employee_branches ON employee_branches.id = employees."branchId"
        ${whereClause}
      `;

      const countQuery = `
        SELECT COUNT(*) AS "count"
        FROM assets
        LEFT JOIN asset_categories ON asset_categories.id = assets."categoryId"
        LEFT JOIN asset_statuses ON asset_statuses.id = assets."assetStatusId"
        LEFT JOIN employees ON employees.id = assets."employeeId"
        LEFT JOIN employee_branches ON employee_branches.id = employees."branchId"
        ${whereClause};
      `;

      const rows = await sequelize.query(query, {
        type: QueryTypes.SELECT,
      });

      const countResult = await sequelize.query(countQuery, {
        type: QueryTypes.SELECT,
      });

      const countObj = countResult[0];
      const count = countObj.count;

      res.json({
        draw: draw,
        recordsTotal: count,
        recordsFiltered: count,
        data: rows,
      });

    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }
}

module.exports = AssetTransaction;
