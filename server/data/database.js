const {Sequelize} = require('sequelize');
const getAppDataPath = require('appdata-path');
const fs = require('fs');

const appDataFolder = () => getAppDataPath('tutoring_tracker');

const databaseFile = () => `${appDataFolder()}/database.db`;

const createDatabaseFolder = () => {
    if (!fs.existsSync(appDataFolder())) fs.mkdirSync(appDataFolder());
};

const openDb = async () => {
    createDatabaseFolder();

    const db = new Sequelize({
        dialect: "sqlite",
        storage: databaseFile(),
        logging: false
    });

    const Student = require('./module/student')(db);
    const Session = require('./module/session')(db);
    Session.belongsTo(Student);

    await Student.sync({alter: true});
    await Session.sync({alter: true});

    return {
        db: db,
        Student: Student,
        Session: Session
    };
};

module.exports = {
    openDb: openDb
};
