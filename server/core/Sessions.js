const moment = require('moment');
const {openDb} = require('../data/database');
const Op = require('sequelize').Op;

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

const deleteSession = async sessionId => {
    const db = await openDb();
    await db.Session.destroy({
        where: {
            id: sessionId
        }
    });
};

const loadRequests = async (paid) => {
    const db = await openDb();
    return await db.Session.findAll({
        where: {
            payment_requested: true,
            payment_paid: paid
        },
        order: ['date'],
        include: [db.Student]
    });
};

const requestSessions = async (db, ids) => {
    await db.Session.update(
        {payment_requested: true},
        {
            where: {
                id: {
                    [Op.or]: ids
                }
            }
        }
    );
};

const requestSession = async id => {
    const db = await openDb();
    await requestSessions(db, [id]);
};

const requestBulk = async studentId => {
    const db = await openDb();
    const sessions = await db.Session.findAll({
        where: {
            StudentId: studentId
        }
    });
    const ids = sessions.map(session => session.id);
    await requestSessions(db, ids);
};

const markPaid = async id => {
    const db = await openDb();
    await db.Session.update(
        {payment_paid: true},
        {
            where: {id: id}
        }
    );
};

module.exports = {
    loadSessions,
    addSession,
    loadRequests,
    deleteSession,
    requestSession,
    requestBulk,
    markPaid
};
