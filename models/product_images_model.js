module.exports = (Sequelize, DataTypes) => {
    const product_images = Sequelize.define('product_images', {
        product_image_id : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        product_id: DataTypes.INTEGER(11),
        file_name: DataTypes.STRING(500),
        mime_type: DataTypes.STRING(50),
        thumbnail: DataTypes.STRING(500),
        is_active: {
            type: DataTypes.BOOLEAN(),
            default: 1
        },
        created_at: DataTypes.DATE(),
        updated_at: DataTypes.DATE(),
    }, {
        table_name: 'product_images',
        timestamps: false
    });

    product_images.associate = (models) => {
        // product_images.hasOne(models.products, {
        //     foreignKey: 'product_id',
        //     targetKey: 'product_id'
        // });
    }

    return product_images;
}