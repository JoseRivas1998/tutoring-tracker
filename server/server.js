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

    server = app.listen(port, () => {
        console.log(`Express server running on http://localhost:${port}`);
        onListen();
    });
};
const close = () => {
    if (server) {
        server.close();
        server = null;
    }
};

module.exports = {open, close};
