const {openDb} = require('../data/database');

const loadStudents = async () => {
    const data = await openDb();
    return await data.Student.findAll();
};

const addStudent = async (name, subject, hourly_rate) => {
    const student = {name, subject, hourly_rate};
    const data = await openDb();
    await data.Student.create(student);
};

const updateStudent = async (student) => {
    const data = await openDb();
    await data.Student.update(
        {
            name: student.name,
            subject: student.subject,
            hourly_rate: student.hourly_rate
        },
        {
            where: {
                id: student.id
            }
        }
    );
};

const deleteStudent = async studentId => {
    const data = await openDb();
    await data.Student.destroy(
        {
            where: {
                id: studentId
            }
        }
    );
};

module.exports = {
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent
};
