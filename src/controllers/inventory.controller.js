const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  createInventory = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create Inventory Success",
      metadata: await InventoryService.addStockToInventory({
        ...req.body,
        shopId: req.session.userId,
      }),
    }).send(res);
  };
}
module.exports = new InventoryController();
