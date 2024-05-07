const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) throw { name: "Unauthorized" };

    const accessToken = bearerToken.split(" ")[1];

    const payload = verifyToken(accessToken);

    const user = await User.findOne({
      where: {
        email: payload.email,
      },
    });

    if (!user) throw { name: "Unauthorized" };

    req.loginInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
