const User = require('./User');
const Exhibit = require('./Exhibit');

User.hasMany(Exhibit, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Exhibit.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Exhibit };
