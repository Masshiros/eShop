const AccessService = require("../services/access.service.lv0");
const {
  OkResponse,
  CreatedResponse,
  SuccessResponse,
} = require("../core/success.response");

class AccessController {
  signIn = async (req, res, next) => {
    return new SuccessResponse({
      message: "Sign in success",
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    return new CreatedResponse({
      message: "Sign up success",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}
module.exports = new AccessController();
