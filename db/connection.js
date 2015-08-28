var Sequelize = require("sequelize");
var db_connection = new Sequelize(process.env.DATABASE_URL || "postgres:///wanderlist");
// if (process.env.DATABASE_URL) {
//   // the application is executed on Heroku ... use the postgres database
//   sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect:  'postgres',
//     protocol: 'postgres',
//     logging:  true //false
//   })
// } else {
//   // the application is executed on the local machine
//   sequelize = new Sequelize("postgres:///wanderlist");
// }

var User = db_connection.import("../models/user");
var Pin = db_connection.import("../models/pin");
var Photo = db_connection.import("../models/photo");

Photo.belongsTo(Pin);
Pin.belongsTo(User);
Pin.hasMany(Photo);
User.hasMany(Pin);


module.exports = {
  sql: Sequelize,
  do: db_connection,
  models: {
    Photo: Photo,
    Pin: Pin,
    User: User
  }
  // ?ssl=true
}
