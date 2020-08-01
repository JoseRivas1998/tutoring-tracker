const {DataTypes} = require('sequelize');

const defineSession = (sequelize) => {
    return sequelize.define('Session', {
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        duration: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        payment_requested: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        payment_paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
};

module.exports = defineSession;
