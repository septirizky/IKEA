const { Category } = require("../models");

class CategoryController {
  static async create(req, res, next) {
    try {
      const { name } = req.body;

      const category = await Category.create({ name });

      res.status(201).json({ message: `Success create category`, category });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const category = await Category.findAll();

      res.status(200).json({ message: `Success get category`, category });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        throw { name: "NotFound", id };
      }

      await Category.update(
        { name },
        {
          where: {
            id,
          },
        }
      );

      const updateCategory = await Category.findByPk(id);

      res.status(200).json({
        message: `Success update category with id ${id}`,
        updateCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        throw { name: "NotFound", id };
      }

      await Category.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: `Success delete category with ${category.name}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
