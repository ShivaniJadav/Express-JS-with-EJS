const bcrypt = require("bcrypt");
module.exports = (Sequelize, DataTypes) => {
    const users = Sequelize.define('users', {
        user_id : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: DataTypes.STRING(50),
        last_name: DataTypes.STRING(50),
        password: {
            type: DataTypes.STRING(500),
            set(value) {
                this.setDataValue('password', bcrypt.hashSync(value, 10));
            }
        },
        mobile_no: DataTypes.STRING(20),
        email: DataTypes.STRING(50),
        photo: DataTypes.STRING(500),
        email_otp: DataTypes.STRING(10),
        password_otp: DataTypes.STRING(10),
        mobile_otp: DataTypes.STRING(10),
        is_verified: {
            type: DataTypes.BOOLEAN(),
            defaultValue : 0
        },
        is_active: {
            type: DataTypes.BOOLEAN(),
            defaultValue : 1
        },
        is_admin: {
            type: DataTypes.BOOLEAN(),
            defaultValue : 0
        },
        last_password_otp_at: DataTypes.DATE(),
        last_email_otp_at: DataTypes.DATE(),
        created_at: DataTypes.DATE(),
        updated_at: DataTypes.DATE(),
    }, {
        table_name: 'users',
        timestamps: false
    });

    users.beforeCreate(async (user) => {
        user.created_at = new Date();
    });
    
    users.beforeUpdate(async (user) => {
        user.updated_at = new Date();
    });
    users.associate = (models) => {
        // users.hasOne(models.wallets, {
        //     foreignKey: 'user_id',
        //     targetKey: 'user_id'
        // });
        // users.hasMany(models.histories, {
        //     foreignKey: 'user_id',
        //     targetKey: 'user_id'
        // });
        // users.hasMany(models.redeem_requests, {
        //     foreignKey: 'redeem_request_id',
        //     targetKey: 'redeem_request_id'
        // });
    }

    return users;
}