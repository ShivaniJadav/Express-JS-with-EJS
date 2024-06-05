module.exports = (Sequelize, DataTypes) => {
    const wallets = Sequelize.define('wallets', {
        wallet_id : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: DataTypes.INTEGER(11),
        scanned_points: DataTypes.INTEGER(11),
        withrawn_points: DataTypes.INTEGER(11),
        created_at: DataTypes.DATE(),
        updated_at: DataTypes.DATE(),
    }, {
        table_name: 'wallets',
        timestamps: false
    });

    wallets.associate = (models) => {
        // wallets.belongsTo(models.users, {
        //     foreignKey: 'user_id',
        //     targetKey: 'user_id'
        // });
    }

    return wallets;
}

