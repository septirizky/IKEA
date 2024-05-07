const { Op } = require("sequelize");
const { Product, Category } = require("../models");

class HomeController {
  static async getCategory(req, res, next) {
    try {
      const category = await Category.findAll();

      res.status(200).json({
        message: `Success get category`,
        category,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProduct(req, res, next) {
    try {
      const { page, search, filter, sort } = req.query;

      let queryOption = {};

      if (search) {
        queryOption.where = {
          name: {
            [Op.iLike]: `%${search || ""}%`,
          },
        };
      }

      if (filter) {
        queryOption.where = {
          categoryId: filter,
        };
      }

      if (sort) {
        const orders = sort[0] === "-" ? "DESC" : "ASC";
        const sorting = orders === "DESC" ? sort.slice(1) : sort;

        queryOption.order = [[sorting, orders]];
      }

      let limit = 10;
      let pageNumb = 1;

      if (page) {
        if (page.size) {
          limit = +page.size;
          queryOption.limit = limit;
        }

        if (page.number) {
          pageNumb = +page.number;
          queryOption.offset = limit * (pageNumb - 1);
        }
      }

      const { count, rows } = await Product.findAndCountAll(queryOption);

      res.status(200).json({
        message: `Success get product`,
        page: pageNumb,
        totalData: count,
        totalPage: Math.ceil(count / limit),
        dataPerPage: limit,
        data: rows,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFound", id };
      }

      res.status(200).json({
        message: `Success get product id ${product.id}`,
        product,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = HomeController;
