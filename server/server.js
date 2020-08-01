const express = require('express');
const cors = require('cors');

const core = require('./core/index');

let server;
const open = onListen => {
    let app = express();
    const port = 3001;

    app.use(cors());

    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/students/', async (req, res) => {
        const students = await core.loadStudents();
        res.send(students);
    });

    server = app.listen(port, () => {
        console.log(`Express server running on http://localhost:${port}`);
        onListen();
    });
};
const close =()=> {
    if (server) {
        server.close();
        server = null;
    }
};

module.exports = {open, close};
