module.exports = (Sequelize, DataTypes) => {
    const products = Sequelize.define('products', {
        product_id : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: DataTypes.STRING(50),
        description: DataTypes.STRING(500),
        category_id: DataTypes.INTEGER(11),
        is_deleted: {
            type: DataTypes.BOOLEAN(),
            defaultValue: 0
        },
        is_active: {
            type: DataTypes.BOOLEAN(),
            defaultValue: 1
        },
        created_at: DataTypes.DATE(),
        updated_at: DataTypes.DATE(),
    }, {
        table_name: 'products',
        timestamps: false
    });

    products.associate = (models) => {
        products.belongsTo(models.categories, {
            foreignKey: 'category_id',
            targetKey: 'category_id'
        });
        products.hasOne(models.product_images, {
            foreignKey: 'product_id',
            targetKey: 'product_id'
        });
    }

    return products;
}