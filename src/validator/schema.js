const { z } = require('zod');

const employeeValidationSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  phone: z.number(),
  branchId: z.number().positive().min(1),
  roleId: z.number().positive().min(1),
});

const assetValidationSchema = z.object({
  name: z.string().min(1).max(255),
  model: z.string().min(1).max(255),
  serialNumber: z.string().min(1).max(255),
  typeId: z.number().positive().min(1),
  categoryId: z.number().positive().min(1),
  amount: z.number().positive().min(1),
});

const employeeRoleValidationSchema = z.object({
  name: z.string().min(1).max(255),
});

const AssetTransactionValidationSchema = z.object({
  assetId: z.number().positive().min(1),
  assetTransactionTypeId: z.number().positive().min(1).nullable(),
  employeeId: z.number().positive().min(1).nullable(),
  assetStatusId: z.number().positive().min(1),
  amount: z.number().optional().nullable(),
});

module.exports = {
  employeeValidationSchema,
  assetValidationSchema,
  employeeRoleValidationSchema,
  AssetTransactionValidationSchema,
};
