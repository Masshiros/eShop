const AccessService = require("../services/access.service.lv0");
const { OkResponse, CreatedResponse } = require("../core/success.response");

class AccessController {
  signUp = async (req, res, next) => {
    return new CreatedResponse({
      message: "Sign up success",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}
module.exports = new AccessController();
