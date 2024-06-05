module.exports = (Sequelize, DataTypes) => {
    const access_tokens = Sequelize.define('access_tokens', {
        token_id : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: DataTypes.INTEGER(11),
        token: DataTypes.STRING(500),
        is_logged_out: {
            type: DataTypes.BOOLEAN(),
            default: 0
        },
        created_at: DataTypes.DATE(),
        updated_at: DataTypes.DATE(),
    }, {
        table_name: 'access_tokens',
        timestamps: false
    });

    access_tokens.associate = (models) => {
        // access_tokens.hasMany(models.users, {
        //     foreignKey: 'user_id',
        //     targetKey: 'user_id'
        // });
    }

    return access_tokens;
}