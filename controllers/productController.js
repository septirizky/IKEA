const { Product, User } = require("../models");
const cloudinary = require("../middlewares/cloudinary");

class ProductController {
  static async create(req, res, next) {
    try {
      const { userId } = req.loginInfo;

      const { name, description, price, stock, imgUrl, categoryId } = req.body;

      const products = await Product.create({
        name,
        description,
        price,
        stock,
        imgUrl,
        categoryId,
        userId,
      });

      res.status(201).json({
        message: `Success create product`,
        products,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const products = await Product.findAll({
        include: {
          model: User,
          attributes: {
            exclude: "password",
          },
        },
      });

      res.status(200).json({
        message: `Success get data product and user`,
        products,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
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

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, stock, imgUrl, categoryId, userId } =
        req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFound", id };
      }

      await Product.update(
        { name, description, price, stock, imgUrl, categoryId, userId },
        {
          where: {
            id,
          },
        }
      );

      const updatedProduct = await Product.findByPk(id);

      res.status(200).json({
        message: `Success update product id ${id}`,
        updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFound", id };
      }

      await Product.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: `Success delete with name ${product.name}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateImageUrl(req, res, next) {
    try {
      const { id } = req.params;
      const products = await Product.findByPk(id);

      if (!products) throw { name: "NotFound" };

      const buffer = req.file.buffer.toString("base64");
      const base64 = `data:image/type;base64,${buffer}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "IKEA/Product",
      });

      await products.update({ imgUrl: result.secure_url });

      res.status(200).json({
        message: "Success update image",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
