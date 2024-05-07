const { Customer } = require("../models");
const cloudinary = require("../middlewares/cloudinary");

class CustomerController {
  static async getAll(req, res, next) {
    try {
      const customer = await Customer.findAll({
        include: {
          model: User,
        },
      });

      res.status(200).json({
        message: `Success get data customer and user`,
        customer,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { firstname, lastname, photo, phoneNumber, address } = req.body;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        throw { name: "NotFound", id };
      }

      await Customer.update(
        { firstname, lastname, photo, phoneNumber, address },
        {
          where: {
            id,
          },
        }
      );

      const updatedCustomer = await Customer.findByPk(id);

      res.status(200).json({
        message: `Success update customer id ${id}`,
        updatedCustomer,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePhoto(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);

      if (!customer) throw { name: "NotFound" };

      const buffer = req.file.buffer.toString("base64");
      const base64 = `data:image/type;base64,${buffer}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "IKEA/User",
      });

      await customer.update({ photo: result.secure_url });

      res.status(200).json({
        message: "Success update image",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CustomerController;
