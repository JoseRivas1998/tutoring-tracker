const express = require('express');
const cors = require('cors');

const core = require('./core/index');

let server;
const open = onListen => {
    let app = express();
    const port = 3001;

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/students/', async (req, res) => {
        const students = await core.loadStudents();
        res.send(students);
    });

    app.post('/students/', async (req, res) => {
        try {
            await core.addStudent(req.body.name, req.body.subject, req.body.hourly_rate);
            res.status(204).send({});
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        }
    });

    app.put('/students/', async (req, res) => {
        try {
            await core.updateStudent(req.body);
            res.status(204).send({});
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        }
    });

    app.delete('/students/:id', async (req, res) => {
        try {
            await core.deleteStudent(Number(req.params.id));
            res.status(204).send({});
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        }
    });

    app.get('/sessions/', async (req, res) => {
        if (!req.query || !('requested' in req.query)) {
            res.status(400).send({message: 'Required query parameter \'requested\' (bool) missing.'});
            return;
        }
        const sessions = await core.loadSessions(req.query.requested === 'true');
        res.send(sessions);
    });

    app.post('/sessions/', async (req, res) => {
        if (!req.body) {
            res.status(400).send({message: 'No Body Provided'});
            return;
        }
        if (!req.body.date) {
            res.status(400).send({message: 'Missing parameter \'date\' (date_string).'})
            return;
        }
        if (!('duration' in req.body)) {
            res.status(400).send({message: 'Missing parameter \'duration\' (float).'})
            return;
        }
        if (!req.body.StudentId) {
            res.status(400).send({message: 'Missing parameter \'StudentId\' (int).'})
            return;
        }
        try {
            await core.addSession(req.body.date, req.body.duration, req.body.StudentId);
            res.status(204).send({});
        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.delete('/sessions/:id', async (req, res) => {
        try {
            await core.deleteSession(Number(req.params.id));
            res.status(204).send({});
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        }
    });

    app.get('/requests/', async (req, res) => {
        try {
            if (!req.query || !('paid' in req.query)) {
                res.status(400).send({message: 'Requred query parameter \'paid\' (bool) missing.'});
                return;
            }
            const requests = await core.loadRequests(req.query.paid === 'true');
            res.send(requests);
        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.post('/requests/make-request/:id', async (req, res) => {
        try {
            await core.requestSession(Number(req.params.id));
            res.status(204).send({});
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        }
    });

    app.post('/requests/request-bulk/:student', async (req, res) => {
        try {
            await core.requestBulk(Number(req.params.student));
            res.status(204).send({});
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        }
    });

    app.post('/requests/mark-paid/:id', async (req, res) => {
        try {
            await core.markPaid(Number(req.params.id));
            res.status(204).send({});
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        }
    });

    server = app.listen(port, () => {
        console.log(`Express server running on http://localhost:${port}`);
        onListen();
    });
};
const close = () => {
    if (server) {
        server.close();
        server = null;
        require('./data/database').closeDb();
    }
};

module.exports = {open, close};
