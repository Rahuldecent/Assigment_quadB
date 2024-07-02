const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/db")

class User extends Model { };


User.init({
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    last_logged_in: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    sequelize,
    modelName:'user',
    timestamps: false
});



// const User = sequelize.define('User', {
//     user_id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true
//     },
//     user_name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     user_email: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false
//     },
//     user_password: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     user_image: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     total_orders: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0
//     },
//     created_at: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     },
//     last_logged_in: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     }
// }, {
//     timestamps: false
// });

module.exports = User;
