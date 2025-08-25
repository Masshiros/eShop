const JWT = require("jsonwebtoken");
const createTokenPair = (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });
    // jwt verify for test
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`decode verify:: ${decode}`);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};
module.exports = {
  createTokenPair,
};
