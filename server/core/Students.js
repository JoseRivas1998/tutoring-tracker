const {openDb} = require('../data/database');

const loadStudents = async () => {
    const data = await openDb();
    return await data.Student.findAll();
};

const addStudent = async (name, subject, hourly_rate) => {
    const student = {name, subject, hourly_rate};
    const data = await openDb();
    await data.Student.create(student);
    await data.db.close();
};

module.exports = {
    loadStudents,
    addStudent
};
