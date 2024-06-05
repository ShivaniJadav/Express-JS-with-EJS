module.exports = (Sequelize, DataTypes) => {
    const categories = Sequelize.define('categories', {
        category_id : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: DataTypes.STRING(50),
        description: DataTypes.STRING(500),
        is_active: {
            type: DataTypes.BOOLEAN(),
            defaultValue: 1
        },
        is_deleted: {
            type: DataTypes.BOOLEAN(),
            defaultValue : 0
        },
        created_at: DataTypes.DATE(),
        updated_at: DataTypes.DATE(),
    }, {
        table_name: 'categories',
        timestamps: false
    });

    categories.beforeCreate(async (category) => {
        category.created_at = new Date();
    });
    
    categories.beforeUpdate(async (category) => {
        category.updated_at = new Date();
    });

    // categories.associate = (models) => {
    //     categories.hasMany(models.products, {
    //         foreignKey: 'category_id',
    //         targetKey: 'category_id'
    //     });
    // }

    return categories;
}