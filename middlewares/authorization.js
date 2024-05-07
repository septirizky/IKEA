const { User, Product, Category, Customer } = require("../models");

const authorAdmin = async (req, res, next) => {
  try {
    const { role } = req.loginInfo;

    if (role === "Staff") throw { name: "Forbidden" };
    if (role === "Customer") throw { name: "Forbidden" };

    next();
  } catch (error) {
    next(error);
  }
};

const authorProduct = async (req, res, next) => {
  try {
    const { id: userId, role } = req.loginInfo;
    if (role === "Customer") throw { name: "Forbidden" };

    if (role === "Staff") {
      const users = await User.findByPk(userId);

      if (!users) throw { name: "Forbidden" };

      const { id } = req.params;
      const products = await Product.findByPk(id);

      if (!products) throw { name: "NotFound" };

      if (products.userId !== users.id) throw { name: "Forbidden" };
    }

    next();
  } catch (error) {
    next(error);
  }
};

const authorCategory = async (req, res, next) => {
  try {
    const { id: userId, role } = req.loginInfo;
    if (role === "Customer") throw { name: "Forbidden" };

    if (role === "Staff") {
      const users = await User.findByPk(userId);

      if (!users) throw { name: "Forbidden" };

      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) throw { name: "NotFound" };

      if (category.userId !== users.id) throw { name: "Forbidden" };
    }

    next();
  } catch (error) {
    next(error);
  }
};

const authorCustomer = async (req, res, next) => {
  try {
    const { id: userId } = req.loginInfo;

    const users = await User.findByPk(userId);

    if (!users) throw { name: "Forbidden" };

    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) throw { name: "NotFound" };

    if (customer.userId !== users.id) throw { name: "Forbidden" };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authorProduct, authorCategory, authorAdmin, authorCustomer };
