const {Sequelize, DataTypes} = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  logging: true,
  dialect: process.env.DATABASE_DIALECT,
});

const sqldb = {};

sqldb['users'] = require('../models/users_model')(sequelize, DataTypes);
sqldb['access_tokens'] = require('../models/access_tokens_model')(sequelize, DataTypes);
sqldb['wallets'] = require('../models/wallets_model')(sequelize, DataTypes);
sqldb['categories'] = require('../models/categories_model')(sequelize, DataTypes);
sqldb['histories'] = require('../models/histories_model')(sequelize, DataTypes);
sqldb['product_images'] = require('../models/product_images_model')(sequelize, DataTypes);
sqldb['products'] = require('../models/products_model')(sequelize, DataTypes);
sqldb['qr_codes'] = require('../models/qr_codes_model')(sequelize, DataTypes);
sqldb['redeem_requests'] = require('../models/redeem_requests_model')(sequelize, DataTypes);

Object.keys(sqldb).forEach(model => {
    if ('associate' in sqldb[model]) {
        sqldb[model].associate(sqldb)
    }
});

sequelize.sync({force: false})
.then(() => {
    console.log("DB connected");
})
.catch((err) => {
    console.log('Database connection error: ', err);
});


module.exports = { sqldb }