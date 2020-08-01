const {DataTypes} = require('sequelize');

const defineStudent = (sequelize) => {
    return sequelize.define('Student', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hourly_rate: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });
};

module.exports = defineStudent;
