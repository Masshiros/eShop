const AccessService = require("../services/access.service.lv0");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}
module.exports = new AccessController();
