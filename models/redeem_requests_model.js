module.exports = (Sequelize, DataTypes) => {
    const redeem_requests = Sequelize.define('redeem_requests', {
        redeem_request_id : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: DataTypes.INTEGER(11),
        history_id: DataTypes.INTEGER(11),
        product_id: DataTypes.INTEGER(11),
        requested_points: DataTypes.INTEGER(11),
        status: {
            type: DataTypes.BOOLEAN(),
            default: 0
        },
        requested_at: DataTypes.DATE(),
        accepted_at: DataTypes.DATE(),
        rejected_at: DataTypes.DATE(),
    }, {
        table_name: 'redeem_requests',
        timestamps: false
    });

    redeem_requests.associate = (models) => {
        // redeem_requests.belongsTo(models.products, {
        //     foreignKey: 'product_id',
        //     targetKey: 'product_id'
        // });
        // redeem_requests.belongsTo(models.histories, {
        //     foreignKey: 'history_id',
        //     targetKey: 'history_id'
        // });
        // redeem_requests.belongsTo(models.users, {
        //     foreignKey: 'user_id',
        //     targetKey: 'user_id'
        // });
    }

    return redeem_requests;
}