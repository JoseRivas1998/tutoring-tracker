const moment = require('moment');
const {openDb} = require('../data/database');

const loadSessions = async (requested) => {
    const db = await openDb();
    return await db.Session.findAll({
        where: {payment_requested: requested},
        order: ['date'],
        include: [db.Student]
    });
};

const addSession = async (date, duration, StudentId) => {
    const db = await openDb();
    const dateMoment = moment(date);
    if (!dateMoment.isValid()) {
        throw new Error("Date was not able to be parsed.")
    }
    await db.Session.create({
        date: moment(date).toDate(),
        duration: duration,
        StudentId: StudentId
    });
};

module.exports = {
    loadSessions,
    addSession
};
