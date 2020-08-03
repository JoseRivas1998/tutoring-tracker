const {Sequelize} = require('sequelize');
const getAppDataPath = require('appdata-path');
const fs = require('fs');

const appDataFolder = () => getAppDataPath('tutoring_tracker');

const databaseFile = () => `${appDataFolder()}/database.db`;

const createDatabaseFolder = () => {
    if (!fs.existsSync(appDataFolder())) fs.mkdirSync(appDataFolder());
};

let db;

const createDb = async () => {
    createDatabaseFolder();

    const db = new Sequelize({
        dialect: "sqlite",
        storage: databaseFile()
    });

    const Student = require('./module/student')(db);
    const Session = require('./module/session')(db);
    Session.belongsTo(Student);

    await Student.sync();
    await Session.sync();

    return {
        db: db,
        Student: Student,
        Session: Session
    };
};

const openDb = async () => {
    if (!db) db = await createDb();
    return db;
};

const closeDb = () => {
    if (db) {
        db.db.close();
        db = null;
    }
};

module.exports = {
    openDb, closeDb
};
