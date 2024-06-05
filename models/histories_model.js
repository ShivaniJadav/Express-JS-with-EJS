module.exports = (Sequelize, DataTypes) => {
    const histories = Sequelize.define('histories', {
        history_id : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true, 
            primaryKey: true,
        },
        user_id: DataTypes.INTEGER(11),
        product_id: DataTypes.INTEGER(11),
        points: DataTypes.INTEGER(11),
        scanned_at: DataTypes.DATE(),
    }, {
        table_name: 'histories',
        timestamps: false
    });

    histories.associate = (models) => {
        // histories.belongsTo(models.users, {
        //     foreignKey: 'user_id',
        //     targetKey: 'user_id'
        // });
        // histories.belongsTo(models.products, {
        //     foreignKey: 'product_id',
        //     targetKey: 'product_id'
        // });
    }

    return histories;
}