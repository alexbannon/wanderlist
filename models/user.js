module.exports = function(sequelize, DataTypes) {
  var model = sequelize.define("user", {
    twitter_id: DataTypes.INTEGER
    // name: DataTypes.STRING
    // username: DataTypes.STRING,
    // password_digest: DataTypes.STRING
  })
  return model;
}
