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

var User = sequelize.import("../models/user");
var Pin = sequelize.import("../models/pin");
var Photo = sequelize.import("../models/photo");

Photo.belongsTo(Pin);
Pin.belongsTo(User);
Pin.hasMany(Photo);
User.hasMany(Pin);


module.exports = {
  sql: Sequelize,
  do: sequelize,
  models: {
    Photo: Photo,
    Pin: Pin,
    User: User
  }
  // ?ssl=true
}
