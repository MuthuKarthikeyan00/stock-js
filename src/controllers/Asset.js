const Sanitizer = require("../helpers/Sanitizer");
const Utils = require("../helpers/Utils");
const ResponseHandler = require("../helpers/ResponseHandler");
const Validator = require("../validator/Validator");
const { assetValidationSchema } = require("../validator/schema");
const { literal, Op } = require("sequelize");
const AssetCategory = require("../controllers/AssetCategory");
const AssetType = require("../controllers/AssetType");
const AssetStatus = require("./AssetStatus");
const db = require("../models");

class Asset {
  static async render(req, res) {
    const assetCategories = await AssetCategory.fetch();
    const assetTypes = await AssetType.fetch();
    const assetStatuses = await AssetStatus.fetch();

    let data;
    let id = Utils.convertTONumber(req.params.id);
    if (Utils.isGraterthenZero(id)) {
      data = await db.Asset.findOne({
        where: {
          id,
        },
      });
    }

    return res.status(200).render("asset", {
      data,
      assetCategories,
      assetTypes,
      assetStatuses,
    });
  }

  static async handleData(body) {
    return Sanitizer.sanitizeHtml({
      name: String(body.name),
      serialNumber: String(body.serialNumber),
      model: String(body.model),
      typeId: Number(body.typeId),
      categoryId: Number(body.categoryId),
      amount: Number(body.amount),
    });
  }

  static async create(req, res) {
    try {
      const body = req.body;
      const args = await Asset.handleData(body);
      const status = await Validator.validate(args, assetValidationSchema, res);
      if (!status) {
        return ResponseHandler.error(res);
      }
      args.createdAt = new Date().toISOString();
      args.assetStatusId = 1;
      args.assetTransactionTypeId = 1;
      const data = await db.Asset.create(args);

      if (Utils.isGraterthenZero(data.id)) {
        const result = await db.AssetTransaction.create({
          assetId: data.id,
          assetTransactionTypeId: 1,
          amount: data.amount,
          assetStatusId: 1,
          createdAt: new Date().toISOString(),
        });

        if (Utils.isGraterthenZero(result.id))
          return res.status(201).redirect("/asset");
      }
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
        return ResponseHandler.error(res, {}, 400, "invalid id");
      }

      const args = await Asset.handleData(body);

      const status = await Validator.validate(args, assetValidationSchema, res);
      if (!status) {
        return ResponseHandler.error(res);
      }
      args.statusId = 1;
      const isValid = await db.Asset.findOne({
        where: {
          id,
        },
      });
      if (!isValid) {
        return ResponseHandler.error(res, {}, 400, "invalid id");
      }

      const updated_id = await db.Asset.update(args, {
        where: {
          id,
        },
      });

      if (Utils.isGraterthenZero(updated_id[0]))
        return res.status(201).redirect("/asset");
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
        return ResponseHandler.error(res, {}, 400, "invalid id");
      }

      const isValid = await db.Asset.findOne({
        where: {
          id,
        },
      });
      if (!isValid) {
        return ResponseHandler.error(res, {}, 400, "invalid id");
      }

      const updated_id = await db.Asset.update(
        { isDeleted: 1 },
        {
          where: {
            id,
          },
        }
      );

      if (Utils.isGraterthenZero(updated_id[0]))
        return ResponseHandler.success(res, 200, {});
      return ResponseHandler.error(res);
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  static async getAssets(req, res) {
    try {
      let { offset, limit, draw, search, orderColumn, orderDir } = req.body;
      const searchValue = search?.value || "";
      const order = req.body.order;
      const orderBy = order?.columns[orderColumn]?.data;
      orderColumn = orderBy || "id";
      orderDir = orderDir || "desc";

      const whereClause = {
        isDeleted: 0,
        ...(searchValue && {
          [Op.or]: [{ name: { [Op.iLike]: `%${searchValue}%` } }],
        }),
      };

      const { count, rows } = await db.Asset.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: limit,
        order: [[String(orderColumn), String(orderDir)]],

        include: [
          {
            model: db.AssetStatus,
            as : 'assetStatus',
            attributes: [["name", "assetStatusName"]],
            required: false,
          },
          {
            model: db.AssetCategory,
            as: "assetCategory",
            attributes: [["name", "assetCategoryName"]],
            required: false,
          },
          {
            model: db.AssetType,
            as: "assetType",
            attributes: [["name", "assetTypeName"]],
            required: false,
          },
          {
            model: db.Employee,
            as: "employee",
            attributes: [["name", "employeeName"]],
            required: false,
          },
        ],
        raw: true,
      });

      const data = rows.map((row) => {
        return {
          id: row.id,
          name: row.name,
          serialNumber: row.serialNumber,
          model: row.model,
          categoryId: row["assetCategory.assetCategoryName"],
          typeId: row["assetType.assetTypeName"],
          assetStatusId: row["assetStatus.assetStatusName"],
          employeeId: row["employee.employeeName"],
          amount: row.amount,
        };
      });

      res.json({
        draw: draw,
        recordsTotal: count,
        recordsFiltered: count,
        data,
      });
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  static async fetch(args = {}) {
    const search = args?.search || "";
    const assetStatusIds = args?.assetStatusIds || [1, 2, 3, 4];

    const assets = await db.Asset.findAll({
      attributes: [
        [
          literal(
            `CONCAT("Asset"."model", '-', "Asset"."serialNumber", '-', "Asset"."name")`
          ),
          "name",
        ],
        ["id", "id"],
        ["employeeId", "employeeId"],
        [literal(`Employee.name`), "employeeName"],
      ],
      where: {
        isDeleted: 0,
        [Op.or]: [
          { serialNumber: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } },
          { model: { [Op.like]: `%${search}%` } },
        ],
        assetStatusId: {
          [Op.in]: assetStatusIds,
        },
      },
      include: [
        {
          model: db.Employee,
          as : 'employee',
          attributes: [["name", "employeeName"]],
          required: false,
        },
      ],
      raw: true,
    });

    const data = assets.map((asset) => {
      return {
        label: asset.name,
        value: asset.id,
        employeeId: asset.employeeId,
        employeeName: asset.employeeName,
      };
    });
    return data;
  }
}

module.exports = Asset;
