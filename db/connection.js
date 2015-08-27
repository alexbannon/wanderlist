var Sequelize = require("sequelize");
var sequelize = new Sequelize("postgres:///wanderlist");
var User = sequelize.import("../models/user");
var Pin = sequelize.import("../models/pin");
var Photo = sequelize.import("../models/photo");

Photo.belongsTo(Pin);
Pin.belongsTo(User);
Pin.hasMany(Photo);
User.hasMany(Pin);

var pg = require('pg');

pg.connect(process.env.wanderlist, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
module.exports = {
  sql: Sequelize,
  do: sequelize,
  models: {
    Photo: Photo,
    Pin: Pin,
    User: User
  }
}
