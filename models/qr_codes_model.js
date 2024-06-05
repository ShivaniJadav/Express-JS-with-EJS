module.exports = (Sequelize, DataTypes) => {
    const qr_codes = Sequelize.define('qr_codes', {
        qr_code_id : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        product_id: DataTypes.INTEGER(11),
        points: DataTypes.INTEGER(11),
        file_name: DataTypes.STRING(500),
        is_expired: {
            type: DataTypes.BOOLEAN(),
            default: 0
        },
        created_at: DataTypes.DATE(),
        updated_at: DataTypes.DATE(),
    }, {
        table_name: 'qr_codes',
        timestamps: false
    });

    qr_codes.associate = (models) => {
        // qr_codes.hasOne(models.products, {
        //     foreignKey: 'product_id',
        //     targetKey: 'product_id'
        // });
    }

    return qr_codes;
}