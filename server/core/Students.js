const {openDb} = require('../data/database');

const loadStudents = async () => {
    const data = await openDb();
    const students = await data.Student.findAll();
    await data.db.close();
    return students;
};

module.exports = {
    loadStudents
};
