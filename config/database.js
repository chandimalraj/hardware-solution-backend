const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`
);

(async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

module.exports = sequelize;
