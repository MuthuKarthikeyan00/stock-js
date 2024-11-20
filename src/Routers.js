const { Router } = require('express');
const Employee = require('./controllers/Employee');
const EmployeeRole = require('./controllers/EmployeeRole');
const AssetCategory = require('./controllers/AssetCategory');
const Asset = require('./controllers/Asset');
const AssetType = require('./controllers/AssetType');
const AssetStatus = require('./controllers/AssetStatus');
const EmployeeBranch = require('./controllers/EmployeeBranch');
const AssetTransaction = require('./controllers/AssetTransaction');
const AssetTransactionType = require('./controllers/AssetTransactionType');

class Routers {
    static router = Router();

    static init() {
        if (!this.router) {
            throw new Error('This.router is null');
        }

        this.router.get('/employee', Employee.render);
        this.router.get('/employee/:id', Employee.render);
        this.router.post('/getEmployee', Employee.getEmployees);
        this.router.post('/employee', Employee.create);
        this.router.post('/employee/:id', Employee.update);
        this.router.get('/employeeDelete/:id', Employee.delete);

        this.router.get('/employeeRole', EmployeeRole.render);
        this.router.get('/employeeRole/:id', EmployeeRole.render);
        this.router.post('/getEmployeeRole', EmployeeRole.getEmployeeRole);
        this.router.post('/employeeRole', EmployeeRole.create);
        this.router.post('/employeeRole/:id', EmployeeRole.update);
        this.router.get('/employeeRoleDelete/:id', EmployeeRole.delete);

        this.router.get('/asset', Asset.render);
        this.router.get('/asset/:id', Asset.render);
        this.router.post('/getAsset', Asset.getAssets);
        this.router.post('/asset', Asset.create);
        this.router.post('/asset/:id', Asset.update);
        this.router.get('/assetDelete/:id', Asset.delete);

        this.router.get('/assetCategory', AssetCategory.render);
        this.router.get('/assetCategory/:id', AssetCategory.render);
        this.router.post('/getAssetCategory', AssetCategory.getAssetCategories);
        this.router.post('/assetCategory', AssetCategory.create);
        this.router.post('/assetCategory/:id', AssetCategory.update);
        this.router.get('/assetCategoryDelete/:id', AssetCategory.delete);

        this.router.get('/assetType', AssetType.render);
        this.router.get('/assetType/:id', AssetType.render);
        this.router.post('/getAssetType', AssetType.getAssetType);
        this.router.post('/assetType', AssetType.create);
        this.router.post('/assetType/:id', AssetType.update);
        this.router.get('/assetTypeDelete/:id', AssetType.delete);

        this.router.get('/assetStatus', AssetStatus.render);
        this.router.get('/assetStatus/:id', AssetStatus.render);
        this.router.post('/getAssetStatus', AssetStatus.getAssetStatus);
        this.router.post('/assetStatus', AssetStatus.create);
        this.router.post('/assetStatus/:id', AssetStatus.update);
        this.router.get('/assetStatusDelete/:id', AssetStatus.delete);

        this.router.get('/assetTransactionType', AssetTransactionType.render);
        this.router.get('/assetTransactionType/:id', AssetTransactionType.render);
        this.router.post('/getAssetTransactionType', AssetTransactionType.getAssetTransactionType);
        this.router.post('/assetTransactionType', AssetTransactionType.create);
        this.router.post('/assetTransactionType/:id', AssetTransactionType.update);
        this.router.get('/assetTransactionType/:id', AssetTransactionType.delete);

        this.router.get('/employeeBranch', EmployeeBranch.render);
        this.router.get('/employeeBranch/:id', EmployeeBranch.render);
        this.router.post('/getEmployeeBranch', EmployeeBranch.getEmployeeBranch);
        this.router.post('/employeeBranch', EmployeeBranch.create);
        this.router.post('/employeeBranch/:id', EmployeeBranch.update);
        this.router.get('/employeeBranchDelete/:id', EmployeeBranch.delete);

        this.router.get('/assetIssue', AssetTransaction.issueRender);
        this.router.get('/assetReturn', AssetTransaction.returnRender);
        this.router.get('/assetScrap', AssetTransaction.scrapRender);

        this.router.get('/assetsHistroy', AssetTransaction.assetsHistroyRender);
        this.router.post('/getAssetsHistory', AssetTransaction.getAssetsHistory);

        this.router.get('/stockView', AssetTransaction.stockViewRender);
        this.router.post('/getStockView', AssetTransaction.getStockView);
        this.router.post('/assetTransaction', AssetTransaction.create);

        this.router.get('/', (req, res) => {
            res.status(200).redirect("/employee");
        });

        return this.router;
    }
}

module.exports = Routers;
