require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const customerRouter = require("./routes/customer");
const homeRouter = require("./routes/home");
const authentication = require("./middlewares/authentication");
const errorHandler = require("./helpers/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(homeRouter);
app.use(authRouter);
app.use(authentication);
app.use(customerRouter);
app.use(categoryRouter);
app.use(productRouter);

app.use(errorHandler);

module.exports = app;
