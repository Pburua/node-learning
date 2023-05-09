const Sequelize = require("sequelize");

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_DB_NAME,
  MYSQL_PASSWORD,
} = require("../env");

const sequelize = new Sequelize(MYSQL_DB_NAME, MYSQL_USER, MYSQL_PASSWORD, {
  dialect: "mysql",
  host: MYSQL_HOST,
});

module.exports = sequelize;
